"use client";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShow = () => {
    setShow(!show);
    setName(user?.name || "");
    setMessage("");
  };

  const handleUpdateProfile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        setMessage(error.message || "Failed to update profile.");
        return;
      }

      setMessage("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      setShow(false);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2 items-center">
        <Link href={"/profile"}>
          {/* Logo or First letter */}
          <div className="avatar">
            <div className="w-10 overflow-hidden rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
              {user?.image ? (
                <Image
                  alt={user.name?.slice(0, 1) || "User"}
                  src={user.image}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-300 font-bold text-green-900">
                  {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
        </Link>

        <h2>{user?.name}</h2>
        <p>{user?.email}</p>

        <button onClick={handleShow} className="btn btn-error btn-xs">
          {show ? "Cancel" : "Edit Profile"}
        </button>

        {message && <p className="text-sm text-center">{message}</p>}

        {show && (
          <form onSubmit={handleUpdateProfile}>
            <fieldset className="fieldset rounded-box w-md">
              <label className="label">Name</label>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-md"
                placeholder="Name"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="btn text-white bg-red-700 mt-4"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </fieldset>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
