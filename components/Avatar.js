"use client";

import Image from "next/image";
import React from "react";

function Avatar({ src, userName }) {
  return (
    <div>
      {src ? (
        <Image
          className="rounded-full"
          height="30"
          width="30"
          alt="hasImage"
          src={src}
        />
      ) : userName ? (
        <img
          className="rounded-full h-[30px] w-[30px]"
          alt="nameImage"
          src={`https://ui-avatars.com/api/?name=${userName}`}
        />
      ) : (
        <Image
          className="rounded-full"
          height="30"
          width="30"
          alt="noUser"
          src="/assets/avatar.png"
        />
      )}
    </div>
  );
}

export default Avatar;
