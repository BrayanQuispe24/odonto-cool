export interface SpecialtyCard {
  id: string;
  category: 'ortodoncia' | 'implantes' | 'estetica' | 'general';
  badge: string;
  badgeType: 'teal' | 'dark';
  title: string;
  description: string;
  feature: string;
  btnText: string;
  cardVariant: 'dark' | 'teal';
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  tag: string;
  bio: string;
  image: string;
  shortName: string;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Article {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const SPECIALTY_CARDS: SpecialtyCard[] = [
  {
    id: 'ortodoncia-1',
    category: 'ortodoncia',
    badge: 'Ortodoncia Invisible y Convencional',
    badgeType: 'teal',
    title: 'Corrección de mordida con alineadores o brackets',
    description: 'Alineadores transparentes y removibles o brackets de zafiro/metálicos diseñados a medida. Corrige tu sonrisa de forma cómoda y efectiva.',
    feature: '⏱ Resultados precisos',
    btnText: 'Consultar Ortodoncia ➔',
    cardVariant: 'dark',
  },
  {
    id: 'implantes-1',
    category: 'implantes',
    badge: 'Implantología Avanzada',
    badgeType: 'dark',
    title: 'Reposición de piezas dentales perdidas',
    description: 'Implantes de titanio biocompatible y coronas de máxima integración para recuperar la función masticatoria y la estética natural de tu boca.',
    feature: '⚡ Implantes de Carga Inmediata',
    btnText: 'Saber Más ➔',
    cardVariant: 'teal',
  },
  {
    id: 'estetica-1',
    category: 'estetica',
    badge: 'Diseño de Sonrisa (Estética)',
    badgeType: 'teal',
    title: 'Carillas y Blanqueamiento Láser',
    description: 'Carillas de porcelana, carillas en resina de alta estética y blanqueamiento láser para perfeccionar el color, forma y alineación dental.',
    feature: '✨ Cerámica E-Max & Resinas Premium',
    btnText: 'Ver Evaluación',
    cardVariant: 'dark',
  },
  {
    id: 'endodoncia-1',
    category: 'general',
    badge: 'Endodoncia',
    badgeType: 'dark',
    title: 'Tratamiento de conductos sin dolor',
    description: 'Salvamos tus piezas dentales gravemente infectadas o con caries profundas utilizando instrumentación rotatoria avanzada y anestesia digital.',
    feature: '🛡️ Preservación dental total',
    btnText: 'Saber Más ➔',
    cardVariant: 'teal',
  },
  {
    id: 'odontopediatria-1',
    category: 'general',
    badge: 'Odontopediatría',
    badgeType: 'teal',
    title: 'Odontología infantil amigable',
    description: 'Atención especializada, amigable y lúdica para bebés y niños, asegurando que su primera experiencia dental sea positiva y libre de traumas.',
    feature: '👧 Atención Kids Friendly',
    btnText: 'Consultar Odontopediatría ➔',
    cardVariant: 'dark',
  },
  {
    id: 'periodoncia-1',
    category: 'general',
    badge: 'Periodoncia',
    badgeType: 'dark',
    title: 'Tratamiento y prevención de encías',
    description: 'Tratamiento de gingivitis y periodontitis para devolver la salud, firmeza y color natural a tus encías, protegiendo el soporte de tus dientes.',
    feature: '✓ Salud Gingival Óptima',
    btnText: 'Saber Más ➔',
    cardVariant: 'teal',
  },
  {
    id: 'cirugia-1',
    category: 'general',
    badge: 'Cirugía Maxilofacial',
    badgeType: 'teal',
    title: 'Extracción de cordales y cirugías complejas',
    description: 'Extracción segura de terceros molares (cordales) y cirugías orales con protocolos de mínima invasión y sedación consciente para cero dolor.',
    feature: '🩺 Especialistas Certificados',
    btnText: 'Agendar Cirugía ➔',
    cardVariant: 'dark',
  },
  {
    id: 'protesis-1',
    category: 'general',
    badge: 'Prótesis Dental',
    badgeType: 'dark',
    title: 'Coronas, puentes y rehabilitación',
    description: 'Devuelve la función y estética con coronas libres de metal, puentes fijos y prótesis removibles de alta resistencia y apariencia 100% natural.',
    feature: '💎 Tecnología CAD/CAM',
    btnText: 'Saber Más ➔',
    cardVariant: 'teal',
  },
  {
    id: 'general-1',
    category: 'general',
    badge: 'Prevención & General',
    badgeType: 'teal',
    title: 'Limpiezas profundas y resinas estéticas',
    description: 'Profilaxis con ultrasonido para eliminar sarro y placa bacteriana, además de resinas (tapaduras) estéticas del mismo color de tu diente natural.',
    feature: '✨ Cero Caries',
    btnText: 'Reservar Limpieza ➔',
    cardVariant: 'dark',
  },
];

export const PILL_BULLETS = [
  { text: 'Tratamientos de caries con resinas estéticas', category: 'general' },
  { text: 'Limpieza dental profunda con ultrasonido', category: 'general' },
  { text: 'Ortodoncia con brackets metálicos y estéticos', category: 'ortodoncia' },
  { text: 'Extracciones seguras y cirugía bucal', category: 'general' },
  { text: 'Prótesis dentales y rehabilitación oral', category: 'implantes' },
  { text: 'Atención personalizada para toda la familia', category: 'general' },
];

export const DOCTORS: Doctor[] = [
  {
    id: 'dr-mendoza',
    name: 'Dr. Carlos Mendoza',
    shortName: 'Dr. Mendoza',
    role: 'Especialista en Rehabilitación Oral & Estética Dental',
    tag: 'Director Médico',
    bio: '"Nuestra filosofía es brindar tratamientos de nivel internacional garantizando la comodidad absoluta del paciente. Una boca sana es el reflejo de la salud integral."',
    image: '/assets/images/dental_doctor.png',
  },
  {
    id: 'dra-valenzuela',
    name: 'Dra. Sofía Valenzuela',
    shortName: 'Dra. Valenzuela',
    role: 'Especialista en Ortodoncia Invisible & Invisalign®',
    tag: 'Invisalign® Provider',
    bio: '"La ortodoncia invisible nos permite alinear tus dientes sin interferir en tu estilo de vida. Resultados precisos, cómodos y totalmente estéticos."',
    image: '/assets/images/dental_smile.png',
  },
  {
    id: 'dr-reyes',
    name: 'Dr. Fernando Reyes',
    shortName: 'Dr. Reyes',
    role: 'Cirujano Implantólogo & Periodoncista',
    tag: 'Cirugía Guiada Computarizada',
    bio: '"Especializados en devolver la función masticatoria completa en 24 horas gracias a implantes de carga inmediata y planificación tomográfica digital."',
    image: '/assets/images/dental_tech.png',
  },
  {
    id: 'dra-torres',
    name: 'Dra. Lucía Torres',
    shortName: 'Dra. Torres',
    role: 'Odontopediatría & Prevención Familiar',
    tag: 'Odontología Infantil',
    bio: '"Creemos en construir experiencias dentales positivas y sin miedo desde la primera infancia para garantizar sonrisas sanas toda la vida."',
    image: '/assets/images/dental_reception.png',
  },
];

export const FACILITIES: Facility[] = [
  {
    id: 'facility-1',
    title: 'Recepción Confortable',
    description: 'Ambiente climatizado, aromaterapia y bebidas frías/calientes para tu espera.',
    image: '/assets/images/dental_reception.png',
  },
  {
    id: 'facility-2',
    title: 'Suite de Escaneo Digital iTero®',
    description: 'Captura digital precisa de tu dentadura en 60 segundos sin necesidad de impresiones de silicona.',
    image: '/assets/images/dental_tech.png',
  },
  {
    id: 'facility-3',
    title: 'Quirófano Digital Mínimamente Invasivo',
    description: 'Sistemas de anestesia computarizada de micro-dosificación y sedación sin dolor.',
    image: '/assets/images/dental_doctor.png',
  },
  {
    id: 'facility-4',
    title: 'Laboratorio CAD/CAM de Carillas',
    description: 'Fresado computarizado de prótesis de porcelana en menos de 24 horas.',
    image: '/assets/images/dental_smile.png',
  },
];

export const ARTICLES: Article[] = [
  {
    id: 'article-1',
    tag: 'Estética Dental',
    title: '5 Beneficios de la ortodoncia invisible frente a los brackets tradicionales',
    description: 'Descubre por qué Invisalign es la opción preferida para alinear tus dientes de forma discreta y cómoda.',
    image: '/assets/images/dental_smile.png',
  },
  {
    id: 'article-2',
    tag: 'Prevención',
    title: '¿Por qué es fundamental la limpieza dental profesional cada 6 meses?',
    description: 'Aprende cómo prevenir la gingivitis y eliminar el sarro acumulado que el cepillado común no alcanza.',
    image: '/assets/images/dental_reception.png',
  },
  {
    id: 'article-3',
    tag: 'Innovación',
    title: 'Implantes dentales de carga inmediata: recupera tu diente en 1 solo día',
    description: 'Una mirada técnica a la tecnología de cirugía guiada por computadora que permite colocar una prótesis fija sin esperas prolongadas.',
    image: '/assets/images/dental_tech.png',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Cómo puedo agendar mi primera cita de valoración?',
    answer: 'Puedes agendar directamente haciendo clic en nuestros botones de reserva, comunicándote por WhatsApp al +593 99 123 4567 o llamando a nuestra central de atención.',
  },
  {
    id: 'faq-2',
    question: '¿Aceptan seguros médicos o convenios dentales?',
    answer: 'Sí. Trabajamos con los principales seguros médicos y prepagadas del país. Te ayudamos a gestionar la documentación necesaria para la cobertura o reembolso directo.',
  },
  {
    id: 'faq-3',
    question: '¿Los tratamientos causan dolor o molestias posteriores?',
    answer: 'No. Contamos con tecnología de anestesia digital computarizada sin aguja tradicional y protocolos de sedación consciente para que tu tratamiento sea 100% cómodo.',
  },
  {
    id: 'faq-4',
    question: '¿Qué incluye la consulta diagnóstica inicial?',
    answer: 'Tu primera evaluación incluye diagnóstico clínico integral por especialista, tomografía/radiografía panorámica digital y un plan de tratamiento detallado sin compromiso.',
  },
  {
    id: 'faq-5',
    question: '¿Atienden emergencias dentales el mismo día?',
    answer: 'Sí, contamos con un turno prioritario de emergencia para atender dolores agudos, traumatismos o fracturas dentales el mismo día que lo solicites.',
  },
];
