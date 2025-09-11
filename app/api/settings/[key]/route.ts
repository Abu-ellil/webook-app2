import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Fetch a specific setting
export async function GET(
    request: NextRequest,
    { params }: { params: { key: string } }
) {
    try {
       

        if (!prisma) {
            console.error('❌ Settings API: Prisma client not available')
            return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
        }

        const setting = await prisma.settings.findUnique({
            where: { key: params.key }
        });

        if (!setting) {
            return NextResponse.json(
                { error: "Setting not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ value: setting.value });
    } catch (error) {
        console.error("❌ Settings API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch setting" },
            { status: 500 }
        );
    }
}

// PUT - Update a specific setting
export async function PUT(
    request: NextRequest,
    { params }: { params: { key: string } }
) {
    try {
        if (!prisma) {
            console.error('Settings PUT API: Prisma client not available')
            return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
        }

        const { value } = await request.json();

        const setting = await prisma.settings.upsert({
            where: { key: params.key },
            update: { value: String(value) },
            create: { key: params.key, value: String(value) }
        });

        return NextResponse.json(setting);
    } catch (error) {
        console.error("Error updating setting:", error);
        return NextResponse.json(
            { error: "Failed to update setting" },
            { status: 500 }
        );
    }
}