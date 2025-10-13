import Basic from "./basic";
import LatexPDF from "./latex_pdf";


export default function Home() {

 

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Resume Analyzer</h1>
      <p className="text-lg mb-4">Analyze and improve your resume with AI-powered insights.</p>
            <Basic />
      <LatexPDF />
        
    </div>
  );
}
