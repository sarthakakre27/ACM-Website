#!/bin/bash

# cd /code && ulimit -Sv ${memoryLimit} &&  time  python3 -u ${jobId}.py -< $"/code/inputFile"

# echo Hello
# echo $1 $2 $3
TIMEFORMAT="Time52442cd9:%3R"

ulimit -Sv $3

if [[ $2 == "py" ]]; then
    fileName=$(ls *.py)
    for ((i = 0; i < (($1 + 1)); i++)); do
        ans=$({ time python3 -u $fileName - <inputFile$i; } 2>&1)
        if [[ $? -ne 0 ]]; then
            echo $ans
            exit 1
        else
            # echo -n \""$i"\":\""$ans"\",
            echo -n \""$i"\":\""$ans"\", | sed -z 's/\n/\\\\n/g'
        fi
    done

elif [[ $2 == "js" ]]; then
    fileName=$(ls *.js)
    for ((i = 0; i < (($1 + 1)); i++)); do
        ans=$({ time node $fileName - <inputFile$i; } 2>&1)
        if [[ $? -ne 0 ]]; then
            echo $ans
            exit 1
        else
            echo -n \""$i"\":\""$ans"\", | sed -z 's/\n/\\\\n/g'
        fi
    done

elif [[ $2 == "java" ]]; then
    fileName=$(ls *.java)
    for ((i = 0; i < (($1 + 1)); i++)); do
        ans=$({ time java $fileName - <inputFile$i; } 2>&1)
        if [[ $? -ne 0 ]]; then
            echo $ans
            exit 1
        else
            echo -n \""$i"\":\""$ans"\", | sed -z 's/\n/\\\\n/g'
        fi
    done

elif [[ $2 == "cpp" ]]; then
    fileName=$(ls *.cpp)
    # compileCode=$(g++ $fileName -o a.out)
    if g++ $fileName -o a.out; then
        for ((i = 0; i < (($1 + 1)); i++)); do
            ans=$({ time ./a.out - <inputFile$i; } 2>&1)
            echo -n \""$i"\":\""$ans"\", | sed -z 's/\n/\\\\n/g'
        done
    else
        exit
    fi

elif [[ $2 == "c" ]]; then
    fileName=$(ls *.c)
    # compileCode=$(gcc $fileName -o a.out)
    if gcc $fileName -o a.out; then
        for ((i = 0; i < (($1 + 1)); i++)); do
            ans=$({ time ./a.out - <inputFile$i; } 2>&1)
            echo -n \""$i"\":\""$ans"\", | sed -z 's/\n/\\\\n/g'
        done
    else
        exit
    fi
fi
