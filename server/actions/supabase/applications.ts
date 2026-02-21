"use server";

import { supabase } from "@/lib/supabase/client";
import { Tables } from "@/database.types";

/**
 * Fetches all applications for a specific owner wallet.
 */
export async function getApplications(ownerWallet: string) {
    const { data, error } = await supabase
        .from("application")
        .select("*")
        .eq("owner_wallet", ownerWallet);

    if (error) {
        console.error(`Error fetching applications for wallet ${ownerWallet}:`, error);
        throw new Error("Failed to fetch applications");
    }

    return data as Tables<"application">[];
}

/**
 * Fetches a single application by its ID.
 */
export async function getApplicationById(id: number) {
    const { data, error } = await supabase
        .from("application")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(`Error fetching application with ID ${id}:`, error);
        throw new Error("Failed to fetch application");
    }

    return data as Tables<"application">;
}

/**
 * Creates a new application entry, uploading the application file to Supabase Storage first.
 */
export async function createApplication(
    application: Omit<Tables<"application">, "id" | "created_at" | "application_id" | "app_size">,
    file: File
) {
    const bucketName = process.env.SUPABASE_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("Missing SUPABASE_BUCKET_NAME environment variable");
    }

    // Generate a unique path for the file
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${application.owner_wallet}/${fileName}`;

    // 1. Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

    if (uploadError) {
        console.error("Error uploading application file:", uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // 2. Create database record using the storage path as application_id
    const { data, error: dbError } = await supabase
        .from("application")
        .insert([
            {
                ...application,
                application_id: uploadData.path, // This path is used to retrieve the file later
                app_size: file.size, // Store file size in bytes
            },
        ])
        .select()
        .single();

    if (dbError) {
        // Optional: Delete the uploaded file if database insertion fails
        await supabase.storage.from(bucketName).remove([uploadData.path]);

        console.error("Error creating application in database:", dbError);
        throw new Error("Failed to create application record");
    }

    return data as Tables<"application">;
}

/**
 * Generates a temporary signed URL for downloading an application file.
 * @param applicationId The storage path (stored in application_id)
 * @param expiresIn Time in seconds until the URL expires (default: 60)
 */
export async function getApplicationDownloadUrl(applicationId: string, expiresIn = 60) {
    const bucketName = process.env.SUPABASE_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("Missing SUPABASE_BUCKET_NAME environment variable");
    }

    const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(applicationId, expiresIn);

    if (error) {
        console.error(`Error generating signed URL for ${applicationId}:`, error);
        throw new Error("Failed to generate download link");
    }

    return data.signedUrl;
}

/**
 * Emits new licenses for a specific application by increasing the licences_emited counter.
 */
export async function emitLicenses(applicationId: number, amount: number) {
    if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
    }

    const { data: currentApp, error: fetchError } = await supabase
        .from("application")
        .select("licences_emited")
        .eq("id", applicationId)
        .single();

    if (fetchError) {
        console.error(`Error fetching application ${applicationId}:`, fetchError);
        throw new Error("Failed to fetch application");
    }

    const newAmount = (currentApp.licences_emited || 0) + amount;

    const { data, error } = await supabase
        .from("application")
        .update({ licences_emited: newAmount })
        .eq("id", applicationId)
        .select()
        .single();

    if (error) {
        console.error(`Error emitting licenses for application ${applicationId}:`, error);
        throw new Error("Failed to emit licenses");
    }

    return data as Tables<"application">;
}
