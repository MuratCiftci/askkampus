import React, { ChangeEvent, useState } from "react";
import { PhoneOutgoingIcon, UserIcon } from "lucide-react";
import { api } from "~/utils/api";
import { toast } from "~/components/hooks/ui/use-toast";
import { useRouter } from "next/router";
import CommunityList from "./CommunityList";
import cloudinary from "~/utils/cloudinaryConfig";

type FormValues = {
  title: string;
  description: string;
};
const CreatePost = () => {
  const { isLoading, data } = api.community.getCommunityNameAndId.useQuery();

  const utils = api.useContext();
  const router = useRouter();

  const [selectedCommunity, setSelectedCommunity] = useState<
    string | undefined
  >("");
  const [image, setImage] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file || null);
      if (file) {
        uploadImage(file);
      }
    }
  };

  const uploadImage = (imageFile: File) => {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "jkrjhphh");
    data.append("cloud_name", "doit2lcqj");

    fetch("https://api.cloudinary.com/v1_1/doit2lcqj/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data: { url: string }) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const mutate = api.post.createPost.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Post oluşturuldu",
      });
      await router.push(`/post/${data.id}`);
    },

    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  console.log(url, "url");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("community");
    const description = formData.get("description");

    if (!title || !description) {
      toast({
        title: "Error",
        description: "Lütfen tüm alanları doldurunuz.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCommunity) {
      toast({
        title: "Error",
        description: "Lütfen topluluk seçiniz.",
        variant: "destructive",
      });
      return;
    }

    if (typeof title !== "string" || typeof description !== "string") return;

    mutate.mutate({
      title: title,
      body: description,
      community: selectedCommunity,
      image_url: url || "",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" mx-auto mt-12 rounded-lg bg-slate-50 p-4 shadow-lg dark:bg-gray-800 dark:text-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              Yeni Paylaşım Oluştur
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Yeni Paylaşım oluşturarak topluluk üyeleri ile etkileşime
              geçebilirsiniz. Paylaşım oluşturmak için aşağıdaki formu doldurun.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="community_name"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Topluluk
                </label>

                <CommunityList
                  community={data}
                  setSelectedCommunity={setSelectedCommunity}
                />
              </div>
              <div className="mt-2"></div>

              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Başlık
                </label>

                <input
                  type="text"
                  id="community"
                  name="community"
                  autoComplete="community"
                  className="block w-full rounded-md border-0 py-1.5 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  İçerik
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  İçerik Fotoğrafı (Opsiyonel)
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e)}
                  ></input>
                </div>
                {/* //display image */}
                {url ? (
                  <img
                    className="mt-2"
                    src={url}
                    alt="post image"
                    style={{ width: "300px", height: "300px" }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {mutate.isLoading ? "Oluşturuluyor..." : "Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
