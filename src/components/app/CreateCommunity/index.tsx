import React, { useState } from "react";
import { PhoneOutgoingIcon, UserIcon } from "lucide-react";
import { api } from "~/utils/api";
import { toast } from "~/components/hooks/ui/use-toast";
import { useRouter } from "next/router";

type FormValues = {
  title: string;
  description: string;
};
const CreateCommunity = () => {
  const { isLoading, data } = api.community.getCommunityNameAndId.useQuery();
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>("");
  const [query, setQuery] = useState("");

  const filteredCommunities =
    query === ""
      ? data
      : data?.filter((data) => {
          return data.name.toLowerCase().includes(query.toLowerCase());
        });

  const utils = api.useContext();
  const router = useRouter();
  const mutate = api.community.createCommunity.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Topluluk oluşturuldu",
        description: "Artık katılabilirsiniz",
      });
      await router.push(`/community/${data.name}`);

      await utils.community.getCommunities.invalidate();
    },

    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("community");
    const description = formData.get("description");

    if (typeof title !== "string" || typeof description !== "string") return;

    mutate.mutate({
      name: title,
      description: description,
      image_url: "https://picsum.photos/200",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" rounded-lg bg-slate-50 p-4 shadow-lg dark:bg-gray-800 dark:text-gray-100 mx-auto mt-12">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              Yeni Topluluk Oluştur
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Yeni topluluk oluşturarak topluluk üyeleri ile etkileşime
              geçebilirsiniz. Topluluk oluşturmak için aşağıdaki formu doldurun.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="community_name"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Topluluk Adı
                </label>

                <input
                  type="text"
                  id="community"
                  name="community"
                  autoComplete="community"
                  className="block w-full rounded-md border-0 py-1.5 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-2"></div>

              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Topluluk Hakkında
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
                <p className="mt-3 px-3 py-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Topluluğu tanımlayan birkaç cümle yazın.
                </p>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Topluluk Fotoğrafı
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UserIcon
                    className="h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
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

export default CreateCommunity;
