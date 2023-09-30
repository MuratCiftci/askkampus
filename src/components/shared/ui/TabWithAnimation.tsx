import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";

type TabWithAnimationProps = {
  data: {
    label: string;
    value: string;
    desc?: string;
    path: string;
  }[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

export function TabWithAnimation({
  data,
  activeTab,
  setActiveTab,
}: TabWithAnimationProps) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    const tab = data.find((tab) => tab.value === value);

    if (tab) {
      void router.push(tab.path);
    }
  };

  return (
    <Tabs id="custom-animation" value={activeTab}>
      <TabsHeader>
        {data.map(({ label, value }) => (
          <Tab key={value} value={value} onClick={() => handleTabChange(value)}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody
        animate={{
          initial: { y: 250 },
          mount: { y: 0 },
          unmount: { y: 250 },
        }}
      >
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            {desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
