"use client"

import Link from "next/link"
import { IconCirclePlusFilled, IconMail, type Icon, IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isOpen = openItems[item.title]
            const hasSubItems = item.items && item.items.length > 0

            return (
              <div key={item.title}>
                <SidebarMenuItem>
                  {hasSubItems ? (
                    <SidebarMenuButton onClick={() => toggleItem(item.title)} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </div>
                      {isOpen ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
                {hasSubItems && isOpen && (
                  <SidebarMenu className="ml-6">
                    {item.items?.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </div>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
