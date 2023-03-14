import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


const PropertyEditFormTabs = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Seller / Buyer</Tab>
        <Tab>Titles</Tab>
      </TabList>

      <TabPanel>
        <h2>Any content 1</h2>
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
      </TabPanel>
    </Tabs>
  )
}

export default PropertyEditFormTabs