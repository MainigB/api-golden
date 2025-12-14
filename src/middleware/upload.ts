import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Criar diretório de uploads se não existir
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('🔍 FileFilter - Verificando arquivo:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    encoding: file.encoding
  });

  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/*' // Aceitar qualquer tipo de imagem
  ];

  // Verificar se é uma imagem
  if (file.mimetype.startsWith('image/') || allowedMimes.includes(file.mimetype)) {
    console.log('✅ Arquivo aceito pelo fileFilter');
    cb(null, true);
  } else {
    console.log('❌ Arquivo rejeitado pelo fileFilter:', file.mimetype);
    cb(new Error(`Apenas imagens são permitidas. Tipo recebido: ${file.mimetype}`));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB (aumentado para permitir fotos maiores)
  },
  fileFilter: fileFilter
});

// Middleware para servir arquivos estáticos
export const getUploadPath = (filename: string) => {
  return path.join(uploadDir, filename);
};

// Função para obter URL da imagem
export const getImageUrl = (req: any, filename: string) => {
  if (!filename) return null;
  
  // Se já for uma URL completa, retorna como está
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Se for base64, retorna como está
  if (filename.startsWith('data:image/')) {
    return filename;
  }
  
  // Retorna URL relativa para servir o arquivo
  const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${filename}`;
};


