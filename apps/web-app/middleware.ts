import { NextRequest, NextResponse } from "next/server"

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl // get pathname of request (e.g. /blog-slug)
    const hostname = req.headers.get("host") as string // get hostname of request (e.g. demo.fora.co)

    console.log("hostname: ", hostname)

    const currentHost =
        process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
            ? hostname.replace(`.fora.co`, "")
            : hostname.replace(`.localhost:3000`, "")

    if (pathname.startsWith(`/_sites`)) {
        return new Response(null, { status: 404 })
    }

    if (!pathname.includes(".") && !pathname.startsWith("/api")) {
        if (currentHost === "app") {
            if (
                pathname === "/login" &&
                // @ts-expect-error
                (req.cookies["next-auth.session-token"] || req.cookies["__Secure-next-auth.session-token"])
            ) {
                return NextResponse.redirect("/")
            }
            return NextResponse.rewrite(`/app${pathname}`)
        }
        if (hostname === "localhost:3000") {
            // return NextResponse.rewrite(`http://localhost:3000`)
            return
        }
        const url = req.nextUrl.clone()
        url.pathname = `/_sites/${currentHost}${pathname}`;
        return NextResponse.rewrite(url)
    }
}
