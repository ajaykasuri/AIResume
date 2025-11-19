import React from 'react'

const ProfessionalTemplate = () => {

  const renderSection = (key) => {
    switch(key) {
      case 'basics': return (
        <div className="ct-section ct-section-basics" key="basics">
          <h2>{basics.name}</h2>
          <div>{basics.jobTitle}</div>
        </div>
      );
      case 'personal': return personalStatement ? (<div className="ct-section"><div className="ct-section-title">SUMMARY</div><div dangerouslySetInnerHTML={{__html: personalStatement}} /></div>) : null;
      case 'skills': return skills && skills.length ? (<div className="ct-section"><div className="ct-section-title">SKILLS</div><div>{skills.join(', ')}</div></div>) : null;
      case 'experience': return experience && experience.length ? (<div className="ct-section"><div className="ct-section-title">WORK EXPERIENCE</div>{experience.map((e)=>(<div key={e.id}><strong>{e.title}</strong><div>{e.employer}</div></div>))}</div>) : null;
      case 'projects': return projects && projects.length ? (<div className="ct-section"><div className="ct-section-title">RELATED PROJECTS</div>{projects.map((p)=> (<div key={p.id}><strong>{p.title}</strong></div>))}</div>) : null;
      case 'education': return education && education.length ? (<div className="ct-section"><div className="ct-section-title">EDUCATION</div>{education.map((ed)=> (<div key={ed.id}><strong>{ed.degree}</strong><div>{ed.institution}</div></div>))}</div>) : null;
      case 'declaration': return declaration && declaration.description ? (<div className="ct-section"><div className="ct-section-title">DECLARATION</div><div>{declaration.description}</div></div>) : null;
      default: return null;
    }
  };
  return (
    <div>ProfessionalTemplate</div>
  )
}

export default ProfessionalTemplate