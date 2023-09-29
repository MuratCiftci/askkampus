import React from "react";
import { api } from "~/utils/api";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Avatar,
} from "@material-tailwind/react";
import CardSkeleton from "~/components/shared/ui/CardSkeleton";
type UserCardProps = {
  id: string;
};

const UserCard = ({ id }: UserCardProps) => {
  const { data, loading, error } = api.user.getUserInfoAndStats.useQuery({
    id,
  });

  const stats = [
    {
      id: 1,
      name: "Post",
      value: data?._count.posts,
    },
    {
      id: 2,
      name: "Yorum",
      value: data?._count.comments,
    },
    {
      id: 3,
      name: "Takipçi",
      value: 0,
    },
  ];

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <Card className="w-96">
      <div className="flex flex-col items-center justify-center pt-4">
        <img
          src={data?.image}
          alt="profile-picture"
          class="relative inline-block h-32 w-32 rounded-2xl object-cover object-center"
        />
      </div>

      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {data?.name}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          
        </Typography>
      </CardBody>

      <CardFooter>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center justify-center space-x-2"
          >
            <Typography color="blue-gray" className="font-medium">
              {stat.value}
            </Typography>
            <Typography color="blue-gray">{stat.name}</Typography>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
};

export default UserCard;
