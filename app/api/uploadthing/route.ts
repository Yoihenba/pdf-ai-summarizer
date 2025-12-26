// import { createRouteHandler } from "uploadthing/next";

// import { ourFileRouter } from "./core";

// // Export routes for Next App Router
// export const { GET, POST } = createRouteHandler({
//   router: ourFileRouter,

//   // Apply an (optional) custom config:
//   // config: { ... },
// });




// app/api/upload/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";
// import stream from "stream";

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get("file") as File;

//   if (!file || file.type !== "application/pdf") {
//     return NextResponse.json({ error: "Only PDFs allowed." }, { status: 400 });
//   }

//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
//   const passthrough = new stream.PassThrough();
//   passthrough.end(buffer);

//   const uploadPromise = new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw",
//         folder: "pdf_uploads",
//         allowed_formats: ["pdf"],
//         use_filename: true,
//         unique_filename: false,
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );

//     passthrough.pipe(uploadStream);
//   });

//   try {
//     const result = await uploadPromise;
//     return NextResponse.json({ message: "Uploaded successfully", result }, { status: 200 });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable";
import fs from "fs";
import { promisify } from "util";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const readFile = promisify(fs.readFile);

export async function POST(req: Request) {
  try {
    const form = new IncomingForm({ multiples: false, keepExtensions: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.parse(req as any, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const file = data.files.file;
    const fileData = await readFile(file.filepath);

    const uploadResponse = await cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "pdfs" },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = uploadResponse as any;
    stream.end(fileData);

    return NextResponse.json({ url: stream.secure_url });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
