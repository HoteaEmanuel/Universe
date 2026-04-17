import React from 'react'

const ProfileSkelet = () => {
  return (
<div class="relative flex w-64 animate-pulse gap-2 p-4">
  <div class="h-12 w-12 rounded-full container"></div>
  <div class="flex-1">
    <div class="mb-1 h-5 w-3/5 rounded-lg container text-lg"></div>
    <div class="h-5 w-[90%] rounded-lg container text-sm"></div>
  </div>
  <div class="absolute bottom-5 right-0 h-4 w-4 rounded-full container"></div>
</div>
  )
}

export default ProfileSkelet