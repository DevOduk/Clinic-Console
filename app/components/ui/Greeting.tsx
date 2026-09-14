'use client'

import { useUser } from '@/app/context/userContext';

function Greeting() {
    const {profile}=useUser()
  return (
    <h1 className="mb-2.5 font-serif text-[clamp(32px,3.2vw,46px)] font-normal leading-[1.05] tracking-[-0.035em] text-[#20302d]">
      Good morning, {profile.firstName ?? ''}
      <span className="text-[#d09c55]">.</span>
    </h1>
  );
}

export default Greeting;
