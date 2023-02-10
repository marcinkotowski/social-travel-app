import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiMailSendLine } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import { useQuery, useQueryClient, useMutation } from "react-query";
import MoonLoader from "react-spinners/MoonLoader";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios.js";
import { GoReport } from "react-icons/go";
import "./options.scss";

const options = ({ postId, postUserId }) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [reported, setReported] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { error, isRefetchError, isRefetching, isLoading, refetch, data } =
    useQuery(
      ["reports", postId],
      ({ signal }) =>
        makeRequest.get(`/reports/${postId}`, { signal }).then((res) => {
          return res.data;
        }),
      {
        enabled: reported,
      }
    );

  const reportMutation = useMutation(
    () => {
      return makeRequest.post("/reports/", { postId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("reports");
      },
    }
  );
  const deleteMutation = useMutation(
    () => {
      return makeRequest.delete(`/posts/${postId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
      },
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate(postId);
  };
  const handleReport = () => {
    setReported(true);
    reportMutation.mutate(postId);
  };

  const detectClickOutside = (ref) => {
    useEffect(() => {
      const handler = (event) => {
        if (!optionsRef.current?.contains(event.target)) {
          setOptionsOpen(false);
          queryClient.cancelQueries("reports");
        }
      };

      document.addEventListener("mousedown", handler);

      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }, [ref]);
  };

  const optionsRef = useRef();
  detectClickOutside(optionsRef);

  const handleClick = () => {
    setOptionsOpen(true);
    if (postUserId !== currentUser.id && !data?.length) refetch();
  };

  return (
    <div className="options-container">
      {!optionsOpen ? (
        <SlOptionsVertical onClick={handleClick} />
      ) : (
        <div ref={optionsRef} className="options">
          {postUserId === currentUser.id ? (
            <>
              <p onClick={handleDelete}>
                <span>
                  <AiOutlineDelete />
                </span>
                <span>Delete</span>
              </p>
              <p onClick={() => setOptionsOpen(false)}>Cancel</p>
            </>
          ) : error || isRefetchError ? (
            <p className="error">Something went wrong</p>
          ) : isLoading || isRefetching ? (
            <p>
              <MoonLoader
                loading={isLoading || isRefetching}
                speedMultiplier={0.7}
                size={13}
                color={"#f7a100"}
              />
            </p>
          ) : data?.length ? (
            <>
              <p>
                <span>
                  <RiMailSendLine />
                </span>
                <span>Reported</span>
              </p>
              <p onClick={() => setOptionsOpen(false)}>Cancel</p>
            </>
          ) : (
            <>
              <p onClick={handleReport}>
                <span>
                  <GoReport />
                </span>
                <span>Report</span>
              </p>
              <p onClick={() => setOptionsOpen(false)}>Cancel</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default options;
