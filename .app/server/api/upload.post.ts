// import path from 'path'
// import fs from 'fs'

// export default defineEventHandler(async (event) => {
//   const files = await readMultipartFormData(event)

//   const uploadedFilePaths: string[] = []

//   files?.forEach((file) => {
//     const dirPath = path.join(
//       process.cwd(),
//       '.app/public/uploads',
//       file.name as string,
//     )
//     if (!fs.existsSync(dirPath)) {
//       fs.mkdirSync(dirPath, { recursive: true })
//     }
//     const filePath = path.join(dirPath, file.filename as string)
//     fs.writeFileSync(filePath, file.data)
//     uploadedFilePaths.push(`/uploads/${file.name}/${file.filename}`)
//   })

//   return uploadedFilePaths
// })

import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);

  const uploadedFilePaths: string[] = [];

  files?.forEach((file) => {
    const dirPath = path.join(
      process.cwd(),
      '.app/public/uploads',
      file.name as string,
    );
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, file.filename as string);
    fs.writeFileSync(filePath, file.data);
    uploadedFilePaths.push(`/uploads/${file.name}/${file.filename}`);

    const chunksDir = path.join(dirPath, 'chunks');
    if (!fs.existsSync(chunksDir)) {
      fs.mkdirSync(chunksDir, { recursive: true });
    }
    const chunkPrefix = path.join(chunksDir, 'chunk');
    execSync(
      `ffmpeg -i "${filePath}" -f segment -segment_time 15 -c copy "${chunkPrefix}%03d${path.extname(
        file.filename,
      )}"`,
    );
    const chunkFiles = fs.readdirSync(chunksDir);
    chunkFiles.forEach((chunkFile) => {
      const oldPath = path.join(chunksDir, chunkFile);
      const newPath = path.join(chunksDir, chunkFile.replace('chunk', 'chunk-'));
      fs.renameSync(oldPath, newPath);
    });

    // Add the new chunk file paths to uploadedFilePaths
    const updatedChunkFiles = fs.readdirSync(chunksDir);
    updatedChunkFiles.forEach((chunkFile) => {
      uploadedFilePaths.push(`/uploads/${file.name}/chunks/${chunkFile}`);
    });
  });

  return uploadedFilePaths;
});
