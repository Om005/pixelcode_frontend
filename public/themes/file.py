import os

ls = os.listdir(".")
# print(ls)

with open("file.txt", 'w') as f:
    for i in ls:
        f.write(i)
        f.write("\n")
    # f.write(ls)