import Link from "next/link";
export default function CategoryCard({id,name,link,image}){
  return(
    <div 
    style={{
      backgroundImage: `
        linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%),
        url("${image}")
      `
    }}
    className="category-card">
      <div>
      <span>{name}</span>
      <Link href={link}>Δες τα προιόντα →</Link>
      </div>
    </div>
  );
}