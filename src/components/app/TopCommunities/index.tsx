import React from "react";
import CardList from "~/components/shared/ui/CardList";
import { api } from "~/utils/api";

const TopCommunities = () => {
  const { isLoading, data: communities } =
    api.community.getTopCommunities.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <CardList data={communities} type="community_most_followed" />;
};

export default TopCommunities;
