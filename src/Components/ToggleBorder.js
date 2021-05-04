import React, { useEffect } from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const ToggleBorder = ({ getValue, borders }) => {
  const resources = { ...(borders ? borders : {}), none: { image: "none", price: 0 } };

  const [groupValue, setGroupValue] = React.useState();

  const handleChange = (_event, value) => {
    if (value) {
      setGroupValue(value);
    }
  };

  useEffect(() => {
    if (getValue) {
      getValue(groupValue);
    }
  }, [, groupValue, setGroupValue]);

  return (
    <ToggleButtonGroup
      size="large"
      value={groupValue}
      exclusive
      onChange={handleChange}
      className="toggle-border"
    >
      {Object.keys(resources)
        .filter((x) => resources[x].image !== "empty")
        .map((x, i) => (
          <ToggleButton
            key={`border-option-${i}`}
            value={resources[x]}
            aria-label="left aligned"
            className="border-toggle-item"
          >
            {x !== "none" ? (
              <>
                <img src={resources[x].image} className="img-border" />
                <div className="border-price">+ R{resources[x].price}</div>
              </>
            ) : (
              <div className="text-white">None</div>
            )}
          </ToggleButton>
        ))}
    </ToggleButtonGroup>
  );
};

export default ToggleBorder;
