export interface SkillSet {
  languages: string;
  tools: string;
  web: string;
  devops: string;
}

export interface Experience {
  role: string;
  company: string;
  dates: string;
  location: string;
  points: string[];
}

export interface Project {
  name: string;
  github: string;
  live?: string;
  points: string[];
}

export interface Certification {
  title: string;
  org: string;
  date: string;
}

export interface Education {
  institution: string;
  duration: string;
  degree: string;
  grade: string;
}

export interface ResumeData {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: SkillSet;
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
}

export function dynamicResumeTemplate(data: ResumeData): string {
  const {
    name,
    phone,
    email,
    linkedin,
    github,
    summary,
    skills,
    experience,
    projects,
    certifications,
    education,
  } = data;

  const escape = (text: string = ""): string =>
    text
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_")
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}")
      .replace(/\^/g, "\\textasciicircum{}")
      .replace(/~/g, "\\textasciitilde{}");

  const formatExperience = (list: Experience[] = []): string => `
\\resumeSubHeadingListStart
${list
  .map(
    (exp) => `
  \\resumeSubheading{${escape(exp.role)}}{${escape(exp.dates)}}{${escape(exp.company)}}{${escape(exp.location)}}
  \\resumeItemListStart
  ${exp.points.map((p) => `\\resumeItem{${escape(p)}}`).join("\n")}
  \\resumeItemListEnd
`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
`;

  const formatProjects = (list: Project[] = []): string => `
\\resumeSubHeadingListStart
${list
  .map(
    (p) => `
  \\resumeSubheading{${escape(p.name)}}{\\href{${p.github}}{\\underline{GitHub}}${
      p.live ? `\\,|\\,\\href{${p.live}}{\\underline{Live}}` : ""
    }}{}{ }
  \\resumeItemListStart
  ${p.points.map((pt) => `\\resumeItem{${escape(pt)}}`).join("\n")}
  \\resumeItemListEnd
`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
`;

  const formatCertifications = (list: Certification[] = []): string =>
    list
      .map(
        (c) =>
          `\\item \\textbf{${escape(c.title)}} (${escape(c.org)}, ${escape(c.date)})`
      )
      .join("\n");

  const formatEducation = (list: Education[] = []): string => `
\\resumeSubHeadingListStart
${list
  .map(
    (e) => `
  \\resumeSubheading{${escape(e.institution)}}{${escape(e.duration)}}{${escape(e.degree)}}{${escape(e.grade)}}
`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
`;

  return `\\documentclass[letterpaper,10pt]{article}
\\usepackage[T1]{fontenc} % ✅ Fix font warning
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}

\\setlength{\\multicolsep}{-2.0pt}
\\setlength{\\columnsep}{-1pt}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-0.7in}
\\addtolength{\\textheight}{1.3in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\color{black}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{1pt}\\vspace{2pt}]

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small #3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-6pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[itemsep=0pt,topsep=0pt]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-6pt}}
\\newcommand{\\resumeItem}[1]{\\item #1}

\\begin{document}

\\begin{center}
  {\\Huge \\scshape ${escape(name)}} \\\\ \\vspace{2pt}
  \\small 
  \\raisebox{-0.1\\height}\\faPhone\\ ${escape(phone)} ~ 
  \\href{mailto:${escape(email)}}{\\raisebox{-0.2\\height}\\faEnvelope\\ \\underline{${escape(email)}}} ~
  \\href{${escape(linkedin)}}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{LinkedIn}} ~
  \\href{${escape(github)}}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{GitHub}}
\\end{center}

\\section{Summary}
${escape(summary)}

\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}, itemsep=0pt]
  \\item \\textbf{Programming Languages:} ${escape(skills.languages)}
  \\item \\textbf{Technologies \\& Tools:} ${escape(skills.tools)}
  \\item \\textbf{Web Development:} ${escape(skills.web)}
  \\item \\textbf{DevOps:} ${escape(skills.devops)}
\\end{itemize}

\\section{Experience}
${formatExperience(experience)}

\\section{Projects}
${formatProjects(projects)}

\\section{Courses \\& Certifications}
\\begin{itemize}[leftmargin=0.15in, label={}, itemsep=2pt, topsep=2pt]
${formatCertifications(certifications)}
\\end{itemize}

\\section{Education}
${formatEducation(education)}

\\end{document}`;
}
