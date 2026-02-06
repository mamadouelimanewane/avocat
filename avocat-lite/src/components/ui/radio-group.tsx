"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroup = ({ className, onValueChange, defaultValue, children, ...props }: any) => {
    const [value, setValue] = React.useState(defaultValue)

    const handleChange = (newValue: string) => {
        setValue(newValue)
        onValueChange?.(newValue)
    }

    return (
        <div className={cn("grid gap-2", className)} {...props}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    const item = child as React.ReactElement<any>;
                    return React.cloneElement(item, {
                        checked: value === item.props.value,
                        onCheckedChange: () => handleChange(item.props.value),
                    })
                }
                return child
            })}
        </div>
    )
}

const RadioGroupItem = ({ className, checked, onCheckedChange, value, id, ...props }: any) => {
    return (
        <div
            id={id}
            onClick={onCheckedChange}
            data-state={checked ? "checked" : "unchecked"}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 focus:outline-none cursor-pointer flex items-center justify-center",
                checked && "bg-slate-900",
                className
            )}
            {...props}
        >
            {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
        </div>
    )
}

export { RadioGroup, RadioGroupItem }
