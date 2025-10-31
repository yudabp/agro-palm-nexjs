"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "@/lib/auth-client"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const staticData = {
 navMain: [
    {
      title: "Agro Palma",
      url: "/dashboard/agro-palma",
      icon: IconDashboard,
    },
    {
      title: "Master Data",
      url: "#",
      icon: IconDatabase,
      items: [
        {
          title: "Kendaraan",
          url: "/dashboard/master-data/vehicles",
        },
        {
          title: "Afdeling",
          url: "/dashboard/master-data/afdelings",
        },
        {
          title: "PKS",
          url: "/dashboard/master-data/pks",
        },
        {
          title: "Departemen Karyawan",
          url: "/dashboard/master-data/employee-departments",
        },
        {
          title: "Jabatan Karyawan",
          url: "/dashboard/master-data/employee-positions",
        },
        {
          title: "Golongan Karyawan",
          url: "/dashboard/master-data/employee-groups",
        },
        {
          title: "Jenis Hutang",
          url: "/dashboard/master-data/debt-types",
        },
        {
          title: "Kategori Pengeluaran BKK",
          url: "/dashboard/master-data/bkk-expense-categories",
        },
      ],
    },
    {
      title: "Data Produksi",
      url: "#",
      icon: IconDatabase,
    },
    {
      title: "Data Penjualan",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Data Karyawan",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Keuangan",
      url: "#",
      icon: IconFileDescription,
      items: [
        {
          title: "Keuangan Perusahaan (KP)",
          url: "#",
        },
        {
          title: "Buku Kas Kebun (BKK)",
          url: "#",
        },
        {
          title: "Data Hutang (HT)",
          url: "#",
        },
      ],
    },
    {
      title: "Admin",
      url: "/dashboard/admin/users",
      icon: IconSettings,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession() as any;
  
  // Type assertion to handle the session type properly
  const sessionUser = session?.user as { name?: string; email?: string; image?: string } | undefined;
  
  const userData = sessionUser ? {
    name: sessionUser.name || sessionUser.email?.split('@')[0] || "User",
    email: sessionUser.email || "",
    avatar: sessionUser.image || "/codeguide-logo.png",
  } : {
    name: "Guest",
    email: "guest@example.com", 
    avatar: "/codeguide-logo.png",
  }

 return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard/agro-palma">
                <Image src="/codeguide-logo.png" alt="Agro Palma" width={32} height={32} className="rounded-lg" />
                <span className="text-base font-semibold font-parkinsans">Agro Palma</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staticData.navMain} />
        <NavDocuments items={staticData.documents} />
        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* @ts-ignore */}
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
