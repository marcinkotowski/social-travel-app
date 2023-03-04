import React from "react";
import "./address.scss";

const Address = ({
  customDisplayName: { detail, territory, region },
  other,
  handleSelectedLocation,
}) => {
  return (
    <p
      className="address"
      {...(other && {
        onClick: () =>
          handleSelectedLocation({ detail, territory, region }, other),
      })}
    >
      {detail ? (
        <>
          {detail}
          <br />
          {territory && (
            <span>
              {territory}
              <br />
            </span>
          )}
          {region && (
            <span>
              {region}
              <br />
            </span>
          )}
        </>
      ) : region ? (
        <>
          {region && (
            <>
              {region}
              <br />
            </>
          )}
          {territory && (
            <span>
              {territory}
              <br />
            </span>
          )}
        </>
      ) : (
        <>{territory}</>
      )}
    </p>
  );
};

export default Address;
