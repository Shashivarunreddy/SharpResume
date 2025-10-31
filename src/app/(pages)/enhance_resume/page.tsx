"use client";

import { useState } from "react";

export default function ProfileForm() {
  const [apiKey, setApiKey] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: {
      languages: "",
      tools: "",
      web: "",
      devops: "",
    },
    experience: [{ role: "", dates: "", company: "", location: "", points: [""] }],
    projects: [{ name: "", github: "", live: "", points: [""] }],
    certifications: [{ title: "", org: "", date: "", link: "" }],
    education: [{ institution: "", duration: "", degree: "", grade: "" }],
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    key?: string
  ) => {
    const { name, value } = e.target;
    if (section && key) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (
    section: string,
    index: number,
    key: string,
    value: string | string[]
  ) => {
    const updated = [...(formData as any)[section]];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, [section]: updated }));
  };

  const handleAddField = (section: string, template: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev as any)[section], template],
    }));
  };

  const handleRemoveField = (section: string, index: number) => {
    const updated = [...(formData as any)[section]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [section]: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const payload = { apiKey, jobDescription, formData };
      const res = await fetch("/api/enhance_resume", { // <-- Change endpoint if your backend uses another
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.enhanced) {
        setOutput(JSON.stringify(data.enhanced, null, 2));
      } else if (data && data.raw) {
        // If Gemini raw response available
        setOutput(data.raw);
      } else {
        setOutput("");
        alert("❌ Failed to submit form or no enhanced data returned.");
      }
    } catch (err) {
      setOutput("");
      alert("⚠️ Error submitting form.");
    }
    setLoading(false);
  };

  // ... same UI as before (see previous code) ...

  return (
    <div className="min-h-screen bg-white text-black p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white shadow-lg border border-blue-100 rounded-2xl p-8"
      >
        <h1 className="text-3xl font-semibold text-blue-700 text-center mb-8">
          Enhance Profile Form
        </h1>
        <input
          name="apiKey"
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="input mb-4"
        />
        <textarea
          name="jobDescription"
          placeholder="Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="input mb-4 h-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="input" />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="input" />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input" />
          <input name="linkedin" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} className="input" />
          <input name="github" placeholder="GitHub" value={formData.github} onChange={handleChange} className="input" />
        </div>
        <textarea
          name="summary"
          placeholder="Professional Summary"
          value={formData.summary}
          onChange={handleChange}
          className="input mt-4 h-24"
        />
        <h2 className="section-title">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Languages" value={formData.skills.languages} onChange={(e) => handleChange(e, "skills", "languages")} className="input" />
          <input placeholder="Tools" value={formData.skills.tools} onChange={(e) => handleChange(e, "skills", "tools")} className="input" />
          <input placeholder="Web" value={formData.skills.web} onChange={(e) => handleChange(e, "skills", "web")} className="input" />
          <input placeholder="DevOps" value={formData.skills.devops} onChange={(e) => handleChange(e, "skills", "devops")} className="input" />
        </div>
        <h2 className="section-title">Experience</h2>
        {formData.experience.map((exp, i) => (
          <div key={i} className="border border-blue-100 rounded-lg p-4 mb-4">
            <input placeholder="Role" value={exp.role} onChange={(e) => handleArrayChange("experience", i, "role", e.target.value)} className="input mb-2" />
            <input placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange("experience", i, "company", e.target.value)} className="input mb-2" />
            <input placeholder="Dates" value={exp.dates} onChange={(e) => handleArrayChange("experience", i, "dates", e.target.value)} className="input mb-2" />
            <input placeholder="Location" value={exp.location} onChange={(e) => handleArrayChange("experience", i, "location", e.target.value)} className="input mb-2" />
            <textarea placeholder="Points (comma separated)" value={exp.points.join(", ")} onChange={(e) => handleArrayChange("experience", i, "points", e.target.value.split(","))} className="input" />
            <button type="button" onClick={() => handleRemoveField("experience", i)} className="text-red-500 mt-2 text-sm">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddField("experience", { role: "", company: "", dates: "", location: "", points: [""] })} className="add-btn">
          + Add Experience
        </button>
        <h2 className="section-title">Projects</h2>
        {formData.projects.map((proj, i) => (
          <div key={i} className="border border-blue-100 rounded-lg p-4 mb-4">
            <input placeholder="Project Name" value={proj.name} onChange={(e) => handleArrayChange("projects", i, "name", e.target.value)} className="input mb-2" />
            <input placeholder="GitHub Link" value={proj.github} onChange={(e) => handleArrayChange("projects", i, "github", e.target.value)} className="input mb-2" />
            <input placeholder="Live Link" value={proj.live} onChange={(e) => handleArrayChange("projects", i, "live", e.target.value)} className="input mb-2" />
            <textarea placeholder="Points (comma separated)" value={proj.points.join(", ")} onChange={(e) => handleArrayChange("projects", i, "points", e.target.value.split(","))} className="input" />
            <button type="button" onClick={() => handleRemoveField("projects", i)} className="text-red-500 mt-2 text-sm">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddField("projects", { name: "", github: "", live: "", points: [""] })} className="add-btn">
          + Add Project
        </button>
        <h2 className="section-title">Certifications</h2>
        {formData.certifications.map((cert, i) => (
          <div key={i} className="border border-blue-100 rounded-lg p-4 mb-4">
            <input placeholder="Title" value={cert.title} onChange={(e) => handleArrayChange("certifications", i, "title", e.target.value)} className="input mb-2" />
            <input placeholder="Organization" value={cert.org} onChange={(e) => handleArrayChange("certifications", i, "org", e.target.value)} className="input mb-2" />
            <input placeholder="Date" value={cert.date} onChange={(e) => handleArrayChange("certifications", i, "date", e.target.value)} className="input mb-2" />
            <input placeholder="Link" value={cert.link} onChange={(e) => handleArrayChange("certifications", i, "link", e.target.value)} className="input" />
            <button type="button" onClick={() => handleRemoveField("certifications", i)} className="text-red-500 mt-2 text-sm">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddField("certifications", { title: "", org: "", date: "", link: "" })} className="add-btn">
          + Add Certification
        </button>
        <h2 className="section-title">Education</h2>
        {formData.education.map((edu, i) => (
          <div key={i} className="border border-blue-100 rounded-lg p-4 mb-4">
            <input placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)} className="input mb-2" />
            <input placeholder="Duration" value={edu.duration} onChange={(e) => handleArrayChange("education", i, "duration", e.target.value)} className="input mb-2" />
            <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)} className="input mb-2" />
            <input placeholder="Grade" value={edu.grade} onChange={(e) => handleArrayChange("education", i, "grade", e.target.value)} className="input" />
            <button type="button" onClick={() => handleRemoveField("education", i)} className="text-red-500 mt-2 text-sm">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddField("education", { institution: "", duration: "", degree: "", grade: "" })} className="add-btn">
          + Add Education
        </button>
        <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
        {output && (
          <div className="mt-8">
            <h3 className="font-bold mb-2">Enhanced JSON Output:</h3>
            <pre className="bg-gray-100 p-4 rounded">{output}</pre>
          </div>
        )}
      </form>
    </div>
  );
}
