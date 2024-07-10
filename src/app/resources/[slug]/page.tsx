import { createClient } from "@/prismicio"
import Link from "next/link"

export default async function ResourcePage({ params }: { params: { slug: string } }):Promise<JSX.Element> {
    const {slug} = params
    const client = createClient()
    const resource = await client.getByUID('resource',slug)

    return (
        <>
        <div className="flex flex-col items-start gap-1">
        <Link href="/resources" className="btn">Back</Link>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4">{resource.data.title}</h1>
        </div>
        {resource.data.media.length > 0 ? <></>:null}
        {resource.data.description.length > 0 ? <></>:null}
            </>
    )
}