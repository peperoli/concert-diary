import Link from "next/link"

export default function TableRow({ children, href }) {
  let gridCols = 'grid-cols-1'

  switch (children.length) {
    case 2:
      gridCols = 'grid-cols-2'
      break
    case 3:
      gridCols = 'grid-cols-3'
      break
  }
  return (
    <Link href={href}>
      <a className={`grid items-center px-3 py-2 rounded-md hover:bg-slate-500 ${gridCols}`}>
        {children}
      </a>
    </Link>
  )
}