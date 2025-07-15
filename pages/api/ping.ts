import type { NextApiRequest,NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export default function handler(req:NextRequest,res:NextResponse){
    res.status(200).json({
        status:"InstaSend app is awake",
        Timestamp:new Date().toISOString(),
    }):
}