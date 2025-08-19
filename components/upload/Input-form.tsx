// "use client";
// import { generatePDFSummary, storePdfSummaryAction } from "@/actions/upload-actions";
// import { useUploadThing } from "@/utils/uploadthing";
// import { SignedIn } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useRef } from "react";

// import { useForm, SubmitHandler } from "react-hook-form";
// import { z } from 'zod';


// type FormValues = {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     summary: any;
//     title: string;
//     upload: FileList;
// };

// const schema = z.object({
//   file: z
//   .instanceof(File,{message: 'Invalid file'})
//   .refine(
//     (file)=>file.size<=20*1024*1024,
//     'File size must be less than 20MB'
//   )
//   .refine(
//     (file)=>file.type==='application/pdf',
//     'File must be a pdf'
//   ),
// });

// export default function Form() {

// const formRef = useRef<HTMLFormElement>(null);
//   const router = useRouter();


//    const { startUpload, routeConfig } = useUploadThing(
//         'pdfUploader', {
//             onClientUploadComplete: () => {
//                 console.log("upload complete");
//             },
//             onUploadError: (err) => {
//                 console.log('error occured while uploading', err);
               
//             },
//             onUploadBegin: (fileName) => {
//                 console.log('uploading file', fileName);
//             },
//         }
//     );

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<FormValues>();
//   const onSubmit: SubmitHandler<FormValues>= async (formData)=>{
    
//     console.log("Submitting the form",formData.upload[0])
    
//     const file = formData.upload[0];
//     const validation =schema.safeParse({file});
//     if(!validation.success){
//         console.error(validation.error.format());
//         return;
//     }
//     console.log("Valid file", validation.data.file)


//     const resp =  await startUpload([file])
//     console.log({resp});
//     if(!resp){
//         return;
//     }

   
//      const result = await generatePDFSummary(resp);
//             console.log("Result from generatePDFSummary", result);
//             const { data = null, message = null } = result || {};
//             if (data) {
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                 let storeResult: any;
                
//                 if(data.summary){
//                     storeResult=await storePdfSummaryAction({
//                         summary:data.summary,
//                         ufsUrl:resp[0].serverData.file.url,
//                         title: data.title,
//                         fileName: file.name,
//                     });
                    
//                     formRef.current?.reset();
//                     router.push(`/summaries/${storeResult.data.id}`)
//                     //redirect to summary page
//                 }

//             }
//             console.log("File validation successful:", file.name);
//   }

//   return(
//     <SignedIn>
//     <form onSubmit={handleSubmit(onSubmit)}>
//     <div>
    
//     <input
//      id="file"
//      type="file"
//      accept="application/pdf"
//      {...register("upload",{required:true})}
//      />
//      {errors.upload && <p className="text-red-500">File is required</p>}
      
//     </div>
//     <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">Submit</button>
//     </form>
//     </SignedIn>

//   );
// }








"use client";

import { generatePDFSummary, storePdfSummaryAction } from "@/actions/upload-actions";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

type FormValues = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  summary: any;
  title: string;
  upload: FileList;
};

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= 20 * 1024 * 1024, "File size must be less than 20MB")
    .refine((file) => file.type === "application/pdf", "File must be a PDF"),
});

export default function Form() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { user } = useUser();

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const file = formData.upload[0];

    const validation = schema.safeParse({ file });
    if (!validation.success) {
      console.error(validation.error.format());
      return;
    }

    try {
      // Upload to Cloudinary
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const res = await fetch("/api/cloudinary-upload", {
        method: "POST",
        body: uploadForm,
      });

      const result = await res.json();

if (!res.ok || !result?.secure_url) {
  console.error("Upload failed:", result?.message || "Unknown error");
  return;
}

const fileUrl = result.secure_url;

      // Generate summary
     const summaryResult = await generatePDFSummary({
  userId: user?.id || "",           // get this from Clerk
  pdfUrl: fileUrl,
  filename: file.name,
});

      const { data = null } = summaryResult || {};

      if (data?.summary) {
        const storeResult = await storePdfSummaryAction({
          summary: data.summary,
          ufsUrl: fileUrl,
          title: data.title,
          fileName: file.name,
        });

       if (storeResult && storeResult.success && storeResult.data?.id) {
    formRef.current?.reset();
    router.push(`/summaries/${storeResult.data.id}`);
  } else {
    console.error("Failed to store summary or missing ID", storeResult);
    // Optionally show user feedback here
  }

      }
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };

  return (
    <SignedIn>
      <div className=''>
      <form ref={formRef}  onSubmit={handleSubmit(onSubmit)} className="flex flex-row justify-center items-center gap-1">
        <div className="flex justify-end items-center gap-1">
          <label htmlFor="file" className="block mb-1 font-medium">Upload PDF:</label>
          <input
            id="file"
            type="file"
            accept="application/pdf"
            {...register("upload", { required: true })}
            className="border border-gray-300 p-2 rounded"
          />
          {errors.upload && <p className="text-red-500">File is required and must be a valid PDF under 20MB</p>}
        </div>
        <button
          type="submit"
          className="bg-black/90 hover:bg-black/80 hover:cursor-pointer text-white hover:text-yellow-500 px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
      </div>
    </SignedIn>
  );
}
