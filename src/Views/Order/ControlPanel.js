import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CustomTextField from "../../Components/CustomTextField";
import ToggleButtonContainer from "../../Components/ToggleButton";
import "../../Styles/css/controlpanel.css";
import ToggleImage from "../../Components/ToggleImage";
import ToggleBorder from "../../Components/ToggleBorder";
import CustomizeItem from "../../Components/CustomizeItem";
import Invoice from "./Invoice";
import { useObjectVal } from "react-firebase-hooks/database";
import { getDbRef } from "Helper/firebase";
import { preloadImages } from "Helper/images";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ControlPanel({ getValue, handleCheckoutSubmit }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [invoiceItem, setInvoiceItem] = React.useState();
  const [metals] = useObjectVal(getDbRef("metals"));
  const [borders] = useObjectVal(getDbRef("borders"));

  const [controlValue, setControlValue] = useState({
    primaryName: "",
    cardNumberPosition: "front",
    cardNumberType: "visa",
    borderIndicator: "",
    customText: "",
    textSize: null,
    backgroundIndicator: "",
    logo: null,
    logoWidth: null,
    logoHeight: null,
    keepLogoAspectRatio: false,
  });

  useEffect(() => {
    setInvoiceItem({
      border: controlValue.borderIndicator,
    });
  }, [controlValue]);

  useEffect(() => {
    let metalsImgs = [],
      bordersImgs = [];
    if (metals) {
      metalsImgs = Object.values(metals).map((x) => x.image);
    }

    if (borders) {
      bordersImgs = Object.values(borders).map((x) => x.image);
    }
    preloadImages([...metalsImgs, ...bordersImgs]);
  }, [metals, borders]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (getValue) {
      getValue(controlValue);
    }
  }, [controlValue, setControlValue]);

  const ChipPositionData = [
    { value: "front", label: "Front" },
    { value: "back", label: "Back" },
    { value: "none", label: "None" },
  ];

  const ChipTypeData = [
    { value: "visa", label: "Visa" },
    { value: "mastercard", label: "Master Card" },
    { value: "none", label: "None" },
  ];

  const handleOptions = (value) => {
    if (value) {
      setControlValue({
        ...controlValue,
        cardNumberPosition: value,
      });
    }
  };

  const handleOptionsType = (value) => {
    if (value) {
      setControlValue({
        ...controlValue,
        cardNumberType: value,
      });
    }
  };

  const handleBorderToggle = (value) => {
    if (value) {
      setControlValue({
        ...controlValue,
        borderIndicator: value,
      });
    }
  };

  const handleBackGround = (value) => {
    if (value) {
      setControlValue({
        ...controlValue,
        backgroundIndicator: value,
      });
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Edit Card Info" {...a11yProps(0)} />
          <Tab label="Choose Metal" {...a11yProps(1)} />
          <Tab label="Choose Border" {...a11yProps(2)} />
          <Tab label="Add Logo/Text" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <CustomTextField
          label="Add Name"
          value={controlValue.primaryName}
          onChange={(e) => setControlValue({ ...controlValue, primaryName: e.target.value })}
        />
        <div className="row">
          <div className="col-md-12 control-options">
            <span className="control-options-lebel-text">Card Number On</span>
            <ToggleButtonContainer
              data={ChipPositionData}
              getOptions={handleOptions}
              defaultValue={controlValue.cardNumberPosition}
            />
          </div>
          <div className="col-md-12 control-options">
            <span className="control-options-lebel-text">Card Type</span>
            <ToggleButtonContainer
              data={ChipTypeData}
              defaultValue={controlValue.cardNumberType}
              getOptions={handleOptionsType}
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <ToggleImage metals={metals} getBackground={handleBackGround} />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <ToggleBorder borders={borders} getValue={handleBorderToggle} />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <CustomizeItem
          textSize={controlValue.textSize}
          customText={controlValue.customText}
          customImage={controlValue.logo}
          customImageWidth={controlValue.logoWidth}
          customImageHeight={controlValue.logoHeight}
          keepLogoAspectRatio={controlValue.keepLogoAspectRatio}
          getValue={(value) =>
            value &&
            setControlValue({
              ...controlValue,
              customText: value.customText,
              textSize: value.textSize,
              logo: value.logo,
              logoWidth: value.logoWidth,
              logoHeight: value.logoHeight,
              keepLogoAspectRatio: value.keepLogoAspectRatio,
            })
          }
        />
      </TabPanel>
      <hr></hr>
      <Invoice data={controlValue} handleSubmit={handleCheckoutSubmit} />
    </div>
  );
}
