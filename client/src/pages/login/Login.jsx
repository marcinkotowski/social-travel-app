import React, { useContext } from "react";
import "./login.scss";
import Journey from "../../assets/journey-animate.svg";
import { MdError } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const Login = () => {
  const schema = yup.object().shape({
    username: yup.string().required("Username is a required"),
    password: yup.string().required("Password is a required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/");
    } catch (err) {
      setError("password", { type: "custom", message: err.response.data });
    }
  };

  return (
    <div className="login">
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
          <h2>Sign in</h2>
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
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <div className="error">
              {errors.password && <MdError />}
              <p>{errors.password?.message}</p>
            </div>
            <input type="submit" value="Login" />
          </form>
          <p className="help-info">
            Don't you have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
