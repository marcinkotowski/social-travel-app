import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";

import Journey from "../../assets/journey-animate.svg";
import { useState } from "react";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { MdError } from "react-icons/md";

const Register = () => {
  const schema = yup.object().shape({
    username: yup.string().required("Username is a required"),
    firstName: yup.string().required("First Name is a required"),
    lastName: yup.string(),
    email: yup.string().email().required("Email is a required"),
    password: yup
      .string()
      // .min(8, "Must be 8 characters or more")
      // .matches(/[a-z]+/, "One lowercase character")
      // .matches(/[A-Z]+/, "One uppercase character")
      // .matches(/[@$!%*#?&]+/, "One special character")
      // .matches(/\d+/, "One number")
      .required("Password is a required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password must match")
      .required("Password must match"),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async ({ confirmPassword, ...others }) => {
    try {
      await axios.post("http://localhost:8800/api/auth/register", others);
      navigate("/login");
    } catch (err) {
      setError("username", { type: "custom", message: err.response.data });
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h3>All your travels in one place!</h3>
          <p>
            Comeback to your memories <br />
            whenever you want
          </p>
          <object type="image/svg+xml" data={Journey}>
            Animated form logo
          </object>
          <a href="https://storyset.com/nature">
            Nature illustrations by Storyset
          </a>
        </div>
        <div className="right">
          <h2>Sign up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
            />
            <div className="error">
              {errors.username && <MdError />}
              <p>{errors.username?.message}</p>
            </div>

            <div className="name">
              <div className="firstName">
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                />
                <div className="error">
                  {errors.firstName && <MdError />}
                  <p>{errors.firstName?.message}</p>
                </div>
              </div>
              <div className="lastName">
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                />
                <div className="error">
                  {errors.lastName && <MdError />}
                  <p>{errors.lastName?.message}</p>
                </div>
              </div>
            </div>

            <input
              type="email"
              placeholder="Example@domain.com"
              {...register("email")}
            />
            <div className="error">
              {errors.email && <MdError />}
              <p>{errors.email?.message}</p>
            </div>

            <input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <div className="error">
              {errors.password && <MdError />}
              <p>{errors.password?.message}</p>
            </div>

            <input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
            <div className="error">
              {errors.confirmPassword && <MdError />}
              <p>{errors.confirmPassword?.message}</p>
            </div>
            <input type="submit" value="Register" />
          </form>
          <p className="help-info">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
