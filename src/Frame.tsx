import React from "react";

interface IFrame {
  children: any;
}

const Frame = (props: IFrame) => {
  return <div>{props.children}</div>;
};

export default Frame;
