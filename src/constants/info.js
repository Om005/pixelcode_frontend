const languages = {
    text: {
        value: "text",
        label: "Text",
        boilerplate: ``,
        type: "txt/plain",
        extension: "txt"
    },
    none: {
        value: "none",
        label: "none",
        boilerplate: ``,
        type: "none",
        extension: "none"
    },
    javascript: {
        value: "javascript",
        label: "JavaScript",
        boilerplate: `console.log("Hello, JavaScript!");`,
        type: "text/javascript",
        extension: ".js"
    },
    python: {
        value: "python",
        label: "Python",
        boilerplate: `print("Hello, Python!")`,
        type: "text/x-python",
        extension: ".py"
    },
    java: {
        value: "java",
        label: "Java",
        boilerplate: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
        type: "text/x-java-source",
        extension: ".java"
    },
    csharp: {
        value: "csharp",
        label: "C#",
        boilerplate: `using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello, C#!");
    }
}`,
        type: "text/x-csharp",
        extension: ".cs"
    },
    cpp: {
        value: "cpp",
        label: "C++",
        boilerplate: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`,
        type: "text/x-c++",
        extension: ".cpp"
    },
    go: {
        value: "go",
        label: "Go",
        boilerplate: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}`,
        type: "text/x-go",
        extension: ".go"
    },
    // typescript: {
    //     value: "typescript",
    //     label: "TypeScript",
    //     boilerplate: `console.log("Hello, TypeScript!");`,
    //     type: "application/typescript",
    //     extension: ".ts"
    // },
    rust: {
        value: "rust",
        label: "Rust",
        boilerplate: `fn main() {
    println!("Hello, Rust!");
}`,
        type: "text/x-rust",
        extension: ".rs"
    },
    kotlin: {
        value: "kotlin",
        label: "Kotlin",
        boilerplate: `fun main() {
    println("Hello, Kotlin!")
}`,
        type: "text/x-kotlin",
        extension: ".kt"
    },
    perl: {
        value: "perl",
        label: "Perl",
        boilerplate: `print "Hello, Perl!\\n";`,
        type: "text/x-perl",
        extension: ".pl"
    },
    php: {
        value: "php",
        label: "PHP",
        boilerplate: `<?php
echo "Hello, PHP!";
?>`,
        type: "application/x-httpd-php",
        extension: ".php"
    },
    ruby: {
        value: "ruby",
        label: "Ruby",
        boilerplate: `puts "Hello, Ruby!"`,
        type: "text/x-ruby",
        extension: ".rb"
    },
    swift: {
        value: "swift",
        label: "Swift",
        boilerplate: `print("Hello, Swift!")`,
        type: "text/x-swift",
        extension: ".swift"
    },
    c: {
        value: "c",
        label: "C",
        boilerplate: `#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    return 0;
}`,
        type: "text/x-c",
        extension: ".c"
    },
    bash: {
        value: "bash",
        label: "Bash",
        boilerplate: `echo "Hello, Bash!"`,
        type: "text/x-sh",
        extension: ".sh"
    }
};

export default languages;
