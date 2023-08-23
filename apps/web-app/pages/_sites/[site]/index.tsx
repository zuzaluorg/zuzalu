import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "../../../components/sites/Layout"
import HomeTemplate from "../../../templates/Home"
import { sites } from "../../../data/sites"
// import BlurImage from "@/components/BlurImage";
// import BlogCard from "@/components/BlogCard";
// import Loader from "@/components/sites/Loader";
// import Date from "@/components/Date";
// import prisma from "@/lib/prisma";
// import "../../../styles/globals.css"

export default function Index(props: { site: string; data: string }) {
    const router = useRouter()
    if (router.isFallback) {
        return null
    }

    console.log("site: ", props.site)

    const data = JSON.parse(props.data)
    console.log("data: ", data)

    return (
        <Layout meta={sites.vitalia} subdomain={props.site}>
            <HomeTemplate sessions={[]} events={[]} sitedata={sites.vitalia} />
        </Layout>
    )
}

const domain =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
        ? "https://www.fora.co"
        : "http://localhost:3000"

export async function getStaticPaths() {
    //   const subdomains = await prisma.site.findMany({
    //     select: {
    //       subdomain: true,
    //     },
    //   });
    //   const customDomains = await prisma.site.findMany({
    //     where: {
    //       NOT: {
    //         customDomain: null,
    //       },
    //     },
    //     select: {
    //       customDomain: true,
    //     },
    //   });

    const allSubdomains = Object.entries(sites).map(([_, sitedata]) => sitedata.subdomain)
    const allPaths = [
        ...allSubdomains
        // ...customDomains.map((customDomain) => {
        //   return customDomain.customDomain;
        // }),
    ]
    return {
        paths: allPaths.map((path) => ({ params: { site: path } })),
        fallback: true
    }
}

export async function getStaticProps({ params: { site } }: { params: { site: string } }) {
    //   let filter = {
    //     subdomain: site,
    //   };
    //   if (site.includes(".")) {
    //     filter = {
    //       customDomain: site,
    //     };
    //   }
    //   const data = await prisma.site.findUnique({
    //     where: filter,
    //     include: {
    //       user: true,
    //       posts: {
    //         where: {
    //           published: true,
    //         },
    //         orderBy: [
    //           {
    //             createdAt: "desc",
    //           },
    //         ],
    //       },
    //     },
    //   });

    const [data] = Object.values(sites).filter((siteEntry) => siteEntry.subdomain === site)
    //   if (!data) {
    //     return { notFound: true, revalidate: 10 };
    //   }

    return {
        props: {
            site,
            data: JSON.stringify(data)
        },
        revalidate: 10
    }
}
