<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Log;

class BackupController extends Controller
{
    private $disk = 'local';
    private $directory = 'backups';

    public function index()
    {
        $files = Storage::disk($this->disk)->files($this->directory);
        
        $backups = array_map(function ($file) {
            return [
                'filename' => basename($file),
                'size' => Storage::disk($this->disk)->size($file),
                'last_modified' => Storage::disk($this->disk)->lastModified($file),
            ];
        }, $files);

        // Filter only .sql files
        $backups = array_filter($backups, function ($backup) {
            return pathinfo($backup['filename'], PATHINFO_EXTENSION) === 'sql';
        });

        // Sort by last modified (newest first)
        usort($backups, function ($a, $b) {
            return $b['last_modified'] <=> $a['last_modified'];
        });

        return response()->json(array_values($backups));
    }

    public function store()
    {
        // Ensure backups directory exists
        if (!Storage::disk($this->disk)->exists($this->directory)) {
            Storage::disk($this->disk)->makeDirectory($this->directory);
        }

        $filename = 'backup_' . date('Y-m-d_His') . '.sql';
        $path = Storage::disk($this->disk)->path($this->directory . '/' . $filename);

        $dbHost = env('DB_HOST', '127.0.0.1');
        $dbPort = env('DB_PORT', '5432');
        $dbUser = env('DB_USERNAME', 'postgres');
        $dbName = env('DB_DATABASE', 'clinica_db');
        $dbPass = env('DB_PASSWORD', '');

        // Construct pg_dump command
        $command = sprintf(
            'PGPASSWORD="%s" pg_dump -h %s -p %s -U %s -F p -f "%s" %s',
            $dbPass,
            $dbHost,
            $dbPort,
            $dbUser,
            $path,
            $dbName
        );

        try {
            $result = Process::run($command);

            if ($result->successful()) {
                return response()->json([
                    'message' => 'Backup generado correctamente.',
                    'filename' => $filename
                ]);
            } else {
                Log::error('Backup failed: ' . $result->errorOutput());
                return response()->json([
                    'message' => 'Error al generar el backup.',
                    'error' => $result->errorOutput()
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Backup exception: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al generar el backup.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function restore(Request $request)
    {
        $request->validate([
            'filename' => 'required|string'
        ]);

        $filename = $request->input('filename');
        $path = Storage::disk($this->disk)->path($this->directory . '/' . $filename);

        if (!Storage::disk($this->disk)->exists($this->directory . '/' . $filename)) {
            return response()->json(['message' => 'El archivo de backup no existe.'], 404);
        }

        $dbHost = env('DB_HOST', '127.0.0.1');
        $dbPort = env('DB_PORT', '5432');
        $dbUser = env('DB_USERNAME', 'postgres');
        $dbName = env('DB_DATABASE', 'clinica_db');
        $dbPass = env('DB_PASSWORD', '');

        // Construct psql command for restore
        // Notice we are dropping the database conceptually or just restoring data.
        // It's safer to use clean dump if the backup was created with --clean, but simple pg_dump defaults to plain text inserts/copy.
        // For a plain text SQL, we just pipe it to psql.
        
        $command = sprintf(
            'PGPASSWORD="%s" psql -h %s -p %s -U %s -d %s -f "%s"',
            $dbPass,
            $dbHost,
            $dbPort,
            $dbUser,
            $dbName,
            $path
        );

        try {
            // We may need more timeout for large DB
            $result = Process::timeout(300)->run($command);

            if ($result->successful()) {
                return response()->json([
                    'message' => 'Backup restaurado correctamente.'
                ]);
            } else {
                Log::error('Restore failed: ' . $result->errorOutput());
                return response()->json([
                    'message' => 'Error al restaurar el backup.',
                    'error' => $result->errorOutput()
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Restore exception: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al restaurar el backup.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function download($filename)
    {
        if (!Storage::disk($this->disk)->exists($this->directory . '/' . $filename)) {
            return response()->json(['message' => 'Archivo no encontrado.'], 404);
        }

        return Storage::disk($this->disk)->download($this->directory . '/' . $filename);
    }

    public function destroy($filename)
    {
        if (!Storage::disk($this->disk)->exists($this->directory . '/' . $filename)) {
            return response()->json(['message' => 'Archivo no encontrado.'], 404);
        }

        Storage::disk($this->disk)->delete($this->directory . '/' . $filename);

        return response()->json(['message' => 'Backup eliminado correctamente.']);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file'
        ]);

        $file = $request->file('backup_file');
        
        if ($file->getClientOriginalExtension() !== 'sql') {
            return response()->json(['message' => 'El archivo debe tener extensión .sql'], 422);
        }

        if (!Storage::disk($this->disk)->exists($this->directory)) {
            Storage::disk($this->disk)->makeDirectory($this->directory);
        }

        $filename = 'backup_uploaded_' . date('Y-m-d_His') . '.sql';
        $file->storeAs($this->directory, $filename, $this->disk);

        return response()->json([
            'message' => 'Respaldo cargado exitosamente',
            'filename' => $filename
        ]);
    }
}
