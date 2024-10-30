import React from "react";

export const UserComments = ({ comments }) => {
  console.log(7000, comments);
  return (
    <div>
      {comments.map((item, i) => {
        return <div key={i}>{item.comment}</div>;
      })}
    </div>
  );
};
