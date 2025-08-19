'use server';

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { formatFileNameAsTitle } from "@/utils/format-utils";

interface PdfSummaryType {
    userId?:string,
    ufsUrl:string,
    summary:string,
    title:string,
    fileName:string,
}

// export async function generatePDFSummary(
//     uploadResponse:[
//         {
//             serverData:{
//                 userId:string;
//                 file:{
//                     url:string;
//                     name:string;
//                 };
//             };
//         }
        
//     ]
// )  {
//     if(!uploadResponse){
//         return{
//             success:false,
//             message:"No file uploaded",
//             data:null
//         };
//     }

//     const{
//         serverData:{
//             userId,
//             file:{ url: pdfUrl,name:filename},
        
//         },
//     } =uploadResponse[0];

//     if(!pdfUrl){
//         return{
//             success:false,
//             message:"No file uploaded",
//             data:null
//         };
//     }

//     try {
//         console.log("Extracting PDF from URL:", pdfUrl);
//         const pdfText = await fetchAndExtractPdfText(pdfUrl);
//         console.log({pdfText});

//         let summary;
//         try{
//             summary = await generateSummaryFromGemini(pdfText);
//             console.log({summary});
//         }catch(error){
//             console.error(error);
//             ///////
//         }

//         if(!summary){
//             return {
//                 success:false,
//                 message:"Failed to generate summary",
//                 data:null
//             }
//         }

//             const formatttedfileName=formatFileNameAsTitle(filename);
        

//         return {
//             success: true,
//             message: "summary generated successfully",
//             data: {
//                 title: formatttedfileName,
//                 pdfText,
//                 summary,
//             }
//         };
//     } catch (err) {
//         return {
//             success: false,
//             message: "Error fetching and extracting PDF text",
//             data: null,
//         };
//     }

// }







export async function generatePDFSummary({
  userId,
  pdfUrl,
  filename
}: {
  userId: string;
  pdfUrl: string;
  filename: string;
}) {
  if (!pdfUrl) {
    return {
      success: false,
      message: "No file uploaded",
      data: null
    };
  }

  try {
    console.log("Extracting PDF from URL:", pdfUrl);
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log({ pdfText });

    let summary;
    try {
      summary = await generateSummaryFromGemini(pdfText);
      console.log({ summary });
    } catch (error) {
      console.error(error);
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary",
        data: null
      };
    }

    const formatttedfileName = formatFileNameAsTitle(filename);

    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        title: formatttedfileName,
        pdfText,
        summary,
        ufsUrl: pdfUrl,
        fileName: filename
      }
    };
  } catch (err) {
    return {
      success: false,
      message: "Error fetching and extracting PDF text",
      data: null
    };
  }
}


async function savePdfSummary({
    userId,
    ufsUrl,
    summary,
    title,
    fileName,
}: {
    userId:string;
    ufsUrl:string;
    summary:string;
    title:string;
    fileName:string;
}) {
    //sql inserting pdf summary
    try {
        const sql = await getDbConnection();
        const[savedSummary] =  await sql`
  INSERT INTO pdf_summaries (
    user_id,
    original_file_url,
    summary_text,
    title,
    file_name
  ) VALUES (
    ${userId},
    ${ufsUrl},
    ${summary},
    ${title},
    ${fileName}
  ) RETURNING id,summary_text`;
       return savedSummary;
    } catch(error) {
        console.error('Error saving PDF summary',error);
        throw error;
    }
}

export async function storePdfSummaryAction({
           
           ufsUrl,
           summary,
           title,
           fileName,
}: PdfSummaryType){
    //user is logged in and has userId
    //savedPdfSummary
    //savePdfSummary()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let savedSummary:any;
    try{
        const { userId } = await auth();
        if(!userId){
            return{
                success: false,
                message: 'User not found',
            };
        }
        savedSummary = await savePdfSummary({
            userId,
            ufsUrl,
            summary,
            title,
            fileName,
        });

        if(!savedSummary){
            return{
                success:false,
                message:'Failed to save PDF summary',
            };
        }
       
    } catch (error){
        return{
            success:false,
            message:
              error instanceof Error ? error.message: 'Error saving PDF summary'
        };
    }

    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
        success:true,
        message:'PDF summary saved succesfully',
        data: {
            id:savedSummary.id,
        },
    };
}

