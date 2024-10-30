import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { UserComments } from "./UserComments";
import { postComment } from "../utils/axiosHelper";

export const Comments = ({ postid, comments }) => {
  console.log(postid);
  console.log(50000, comments);
  const [comment, setComment] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const response = await postComment(postid, { comment });
    console.log(2000, response);
  };

  const handleOnChange = (e) => {
    setComment(e.target.value);
  };
  //   const comments = ["comment1", "comment2"];

  return (
    <>
      <Form onSubmit={handleOnSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Comments</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={handleOnChange}
            name="comment"
          />
          <Button className="btn btn-danger mt-4" type="submit">
            Add Comment
          </Button>
        </Form.Group>
      </Form>
      <UserComments comments={comments || []} />
    </>
  );
};
