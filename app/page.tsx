import Landing from "../components/landing/landing";


export default function Home() {
  return (
    <div>
        <Landing />
    </div>
  );
}
// import Landing from "./components/landing/landing";

// import { PrismaClient } from "@/src/app/generated/prisma";





// export default async function Home() {
//   const prisma = new PrismaClient()
//   const users = await prisma.user.findMany({
//     include: {
//       posts: true,
//     },
//   });
//   console.log(users);
//   return (
    
//     <div>
//         {/* <Landing /> */}
//     </div>
//   );

