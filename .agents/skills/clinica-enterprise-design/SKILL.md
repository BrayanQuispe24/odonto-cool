---
name: clinica-enterprise-design
description: Guidelines for building components in the Odonto Cool Pro system following the strict Enterprise Design aesthetic.
---

# Enterprise SaaS Design System & Element Distribution

Guidelines and component blueprints for building or refactoring UI components in the **Enterprise Design System** (matching Odonto Cool Pro architecture).

---

## 1. Core Enterprise Design Philosophy

1. **Boxed Sharpness over Playful Bubbles**:
   - **Never** use `rounded-full`, `rounded-2xl`, or `rounded-3xl` on cards, containers, inputs, or standard action buttons.
   - Standardize on `rounded-sm` (2px-4px) or `rounded` for a crisp, technical, structured aesthetic.
2. **Subtle Border Separation over Heavy Shadows**:
   - Separate surfaces with subtle 1px borders: `border border-slate-200 dark:border-slate-800`.
   - Use subtle shadows (`shadow-sm` or none). Avoid heavy floating drop-shadows (`shadow-2xl`).
3. **No Header Bloat (Zero-Waste Vertical Space)**:
   - Do **NOT** render massive gradient hero headers or redundant title cards at the top of CRUD modules.
   - The top tab bar serves as both the page identifier and view switcher.
4. **Tabs Over Modals for Complex CRUD**:
   - Modals are cramped and cause scrolling issues for rich entity forms.
   - Use clean, borderless top tabs: **Tab 1: Listado** vs **Tab 2: Registrar / Editar**.
   - Reserve modals **strictly** for fast confirmation dialogs (e.g., delete confirmation).
5. **Centralized Focus on Forms**:
   - When switching to the form tab, center the form container at `w-full lg:w-3/5 mx-auto` rather than stretching it across 100% ultra-wide screens.
6. **Responsive Dual-Presentation for Tables**:
   - Desktop (`hidden md:block`): High-density data table with uppercase headers and compact action icons.
   - Mobile (`block md:hidden`): Clean stacked card list with identical enterprise borders and touch-friendly actions.

---

## 2. Color Palette & Theme Tokens

### Tailwind CSS Color Tokens (Tailwind v4 / CSS Variables)
```css
@theme {
  --color-primary: #0077D4;         /* Corporate Action Blue */
  --color-primary-dark: #0840A8;    /* Deep Royal Blue / Hover state */
  --color-secondary: #00C2E0;       /* Cyan accent for highlights & dark mode active text */
  --color-dark-surface: #002D5E;    /* Dark mode cards & panels */
  --color-dark-bg: #001C3D;         /* Dark mode page background & table headers */
  --color-light-surface: #FFFFFF;   /* Light mode card surface */
  --color-light-bg: #F4F9FF;        /* Light mode page background (or slate-50) */

  /* Micro Typography Tokens */
  --text-micro: 0.5625rem;          /* ~9px  */
  --text-tiny: 0.625rem;            /* ~10px */
  --text-small: 0.6875rem;          /* ~11px */
}
```

### Color Rules:
- **Primary Actions**: `bg-[#0077D4] hover:bg-[#0840A8] text-white`.
- **Destructive Actions**: `bg-rose-600 hover:bg-rose-700 text-white`.
- **Success / Positive**: `text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30`.
- **Card Backgrounds**: `bg-white dark:bg-dark-surface`.
- **Muted Headers / Toolbars**: `bg-slate-50 dark:bg-dark-bg`.
- **Text Hierarchy**:
  - Headings: `text-slate-800 dark:text-white font-bold`.
  - Body / Data: `text-slate-700 dark:text-slate-300 font-medium`.
  - Labels & Subtitles: `text-slate-500 dark:text-slate-400`.

---

## 3. Element Distribution Architecture

Every CRUD or management module must follow this standard view distribution:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Page Container (space-y-6)                                             │
│                                                                        │
│ 1. Alert Banner (Conditional, e.g. error/warning)                      │
│                                                                        │
│ 2. Main Tab Navigation                                                 │
│    [ Listado de Entidades ]    [ + Registrar Nueva Entidad ]           │
│ ────────────────────────────────────────────────────────────────────── │
│                                                                        │
│ IF (mainTab === 'list'):                                               │
│ 3. Table Container (bg-white dark:bg-dark-surface border rounded-sm)   │
│    ┌──────────────────────────────────────────────────────────────┐    │
│    │ Toolbar: [ Search Input (max-w-lg) ]      [ Filter Select ] │    │
│    ├──────────────────────────────────────────────────────────────┤    │
│    │ Desktop Table (hidden md:block)                              │    │
│    │ - Uppercase header row (bg-slate-50 dark:bg-dark-bg)         │    │
│    │ - High-density rows with hover transitions                   │    │
│    │ - Right-aligned compact action buttons                       │    │
│    ├──────────────────────────────────────────────────────────────┤    │
│    │ Mobile View (block md:hidden)                                │    │
│    │ - Vertical stack of bordered enterprise cards                │    │
│    ├──────────────────────────────────────────────────────────────┤    │
│    │ Pagination Footer: "Mostrando 1 - 5 de 20"   [ < ] [ 1 ] [ > ]│   │
│    └──────────────────────────────────────────────────────────────┘    │
│                                                                        │
│ IF (mainTab === 'form'):                                               │
│ 4. Centered Form Panel (w-full lg:w-3/5 mx-auto)                       │
│    ┌──────────────────────────────────────────────────────────────┐    │
│    │ Header: [ Icon + Title: "Registrar Nueva..." ]   [ (X) Close]│    │
│    ├──────────────────────────────────────────────────────────────┤    │
│    │ Form Grid: 2-column or 3-column structured field inputs      │    │
│    │ Micro-labels (uppercase tracking-wider)                      │    │
│    ├──────────────────────────────────────────────────────────────┤    │
│    │ Footer: [ Cancelar y Volver ]             [ Guardar Cambios ]│    │
│    └──────────────────────────────────────────────────────────────┘    │
│                                                                        │
│ 5. Delete Confirmation Modal (fixed inset-0 z-50 backdrop-blur-sm)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Reusable Component Blueprints

### Blueprint 1: Tab Navigation Bar
Replaces cluttered buttons and modals. Direct, accessible, zero-waste:

```tsx
<div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
  <button
    onClick={() => setMainTab('list')}
    className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
      mainTab === 'list'
        ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
    }`}
  >
    Listado de Elementos
  </button>
  <button
    onClick={() => { setSelectedItem(null); setMainTab('form'); }}
    className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
      mainTab === 'form'
        ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
    }`}
  >
    Registrar Nuevo Elemento
  </button>
</div>
```

---

### Blueprint 2: Enterprise Data Table Container

#### Container & Toolbar:
```tsx
<div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
  {/* Toolbar */}
  <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface flex flex-col md:flex-row md:items-center justify-between gap-3">
    {/* Search Input */}
    <div className="relative flex-1 max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Search size={15} />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar..."
        className="w-full pl-9 pr-8 px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>

    {/* Filter Select */}
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filtro:</span>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer min-w-[160px]"
      >
        <option value="all">Todos</option>
      </select>
    </div>
  </div>

  {/* Desktop Table View */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 select-none">
          <th className="py-3 px-4">IDENTIFICADOR</th>
          <th className="py-3 px-4">ESTADO</th>
          <th className="py-3 px-4 text-right">ACCIONES</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-small text-slate-700 dark:text-slate-300 font-medium">
        {items.map((item) => (
          <tr
            key={item.id}
            className="bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors"
          >
            <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{item.name}</td>
            <td className="py-3 px-4">
              <span className="inline-flex px-1.5 py-0.5 rounded text-tiny font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {item.status}
              </span>
            </td>
            <td className="py-3 px-4 text-right">
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => onView(item)}
                  title="Ver"
                  className="p-1.5 rounded-sm text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => onEdit(item)}
                  title="Editar"
                  className="p-1.5 rounded-sm text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  title="Eliminar"
                  className="p-1.5 rounded-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 cursor-pointer transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Mobile Stacked Card View */}
  <div className="block md:hidden p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
    {items.map((item) => (
      <div
        key={item.id}
        className="p-4 rounded-sm border bg-white dark:bg-dark-surface border-slate-200 dark:border-slate-800 space-y-3"
      >
        <div className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</div>
        <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onView(item)}
            className="w-full py-1.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer"
          >
            <Eye size={13} /> Ver
          </button>
          <button
            onClick={() => onEdit(item)}
            className="w-full py-1.5 rounded-sm border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer"
          >
            <Edit2 size={13} /> Editar
          </button>
          <button
            onClick={() => onDelete(item)}
            className="w-full py-1.5 rounded-sm border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} /> Eliminar
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Pagination Footer */}
  <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
    <div>
      Mostrando <strong>{startRecord}</strong> - <strong>{endRecord}</strong> de <strong>{totalItems}</strong> registros
    </div>
    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="min-w-[28px] h-7 px-1.5 rounded-sm text-xs font-bold flex items-center justify-center bg-[#0077D4] text-white">
        {currentPage}
      </span>
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
</div>
```

---

### Blueprint 3: Centralized Form Panel (`w-full lg:w-3/5 mx-auto`)

```tsx
<div className="w-full lg:w-3/5 mx-auto animate-fade-in">
  <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm flex flex-col">
    {/* Panel Header */}
    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between">
      <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-wider">
        <Icon size={18} className="text-primary dark:text-secondary" />
        {isEdit ? 'Editar Registro' : 'Nuevo Registro'}
      </h3>
      <button
        type="button"
        onClick={onCancel}
        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
      >
        <X size={18} />
      </button>
    </div>

    {/* Form Body */}
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Nombre <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Categoría
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="A">Opción A</option>
            <option value="B">Opción B</option>
          </select>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto"
        >
          Cancelar y Volver
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold shadow-sm disabled:opacity-50 cursor-pointer transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  </div>
</div>
```

---

### Blueprint 4: Destructive Confirmation Modal

```tsx
{isDeleteModalOpen && itemToDelete && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
    <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-md p-5 text-slate-900 dark:text-white space-y-4">
      {/* Danger Header */}
      <div className="flex items-center gap-3 text-rose-500">
        <div className="p-2 rounded bg-rose-50 dark:bg-rose-900/30">
          <Trash2 size={20} />
        </div>
        <div>
          <h3 className="text-small font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Eliminar Registro
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Esta acción no se puede deshacer.
          </p>
        </div>
      </div>

      <p className="text-small text-slate-600 dark:text-slate-300">
        ¿Estás seguro de que deseas eliminar a{' '}
        <strong className="text-slate-900 dark:text-white font-bold">
          {itemToDelete.name}
        </strong>?
      </p>

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(false)}
          className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirmDelete}
          className="px-4 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-small font-semibold shadow-sm cursor-pointer transition-colors"
        >
          Sí, Eliminar
        </button>
      </div>
    </div>
  </div>
)}
```

---

## 5. Summary Checklist of DOs and DONTs

| Feature | DO (Enterprise Standard) | DON'T (Anti-pattern) |
|---|---|---|
| **Border Radius** | `rounded-sm` (2px-4px) or `rounded` | `rounded-full`, `rounded-2xl`, `rounded-3xl` |
| **Separators** | Thin 1px borders (`border-slate-200 dark:border-slate-800`) | Big floating drop-shadows or glow effects |
| **Page Navigation** | Clean bottom-bordered tabs directly on page background | Bulky floating card tabs, pills, or isolated button bars |
| **CRUD Forms** | Switch tab to centered panel (`w-full lg:w-3/5 mx-auto`) | Cram multi-field forms into tiny popup modals |
| **Action Colors** | `#0077D4` (Action Blue), `#0840A8` (Deep Blue) | Neon cyan, lime, bright purple for primary buttons |
| **Header Typography** | `text-xs font-bold uppercase tracking-wider` | Mixed capitalization or lowercase casual text |
| **Table Actions** | Ghost icon buttons with subtle hover tints | Text buttons taking up row width |
| **Table Padding** | High density (`py-3 px-4`, text size `text-small`) | Sprawling padding (`py-6 px-8`) causing wasted scrolling |
