import React from "react";
import CardList from "~/components/shared/ui/CardList";
import { api } from "~/utils/api";

const LatestCommunities = () => {
  const { isLoading, data: communities } =
    api.community.getLatestCommunities.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <CardList data={communities} type="community_last_added" />;
};

export default LatestCommunities;
