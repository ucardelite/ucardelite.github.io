
//_CRT_SECURE_NO_WARNINGS
#include <list>
#include <stdio.h>
#include <fstream>
#include <string>
#include <iostream>
#include <filesystem>

#include <iostream>
using namespace std;

int main()
{
    string blet = "nachuj";
    cout << blet.length() << "\n";
    char* name = (char*)malloc(blet.length());
    for (int i = 0; i < blet.length(); i++)
    {
        name[i] = blet[i];
    }
    
    cout << name[5];
    free(name);
}
