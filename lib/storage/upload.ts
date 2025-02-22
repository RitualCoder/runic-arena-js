import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

// Création du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export const uploadImage = async ({ file, bucket, folder }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  try {
    file = await imageCompression(file, {
      maxSizeMB: 1,
    });
  } catch (error) {
    console.error(error);
    return { imageUrl: "", error: "Image compression failed" };
  }

  const { data, error } = await supabase.storage.from(bucket).upload(path, file);

  if (error) {
    console.error(error);
    return { imageUrl: "", error: "Image upload failed" };
  }

  const imageUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${data?.path}`;
  return { imageUrl, error: "" };
};

export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  return { data, error };
};
