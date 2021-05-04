

#include <iostream>
#include <iostream>
#include <fstream>
#include <list>
#include <string>
#include <iomanip>
#include <filesystem>
using namespace std;
int main()
{

    string vardai[31] = { "Monika", "Marija", "Polina", "Selena", "Paulius", "Kristupas", "Mantas", "Robertas", "Kriste", "Liuce", "Laurynas", "Kevinas", "Gabrielius", "Julius", "Linas", "Ovidijus", "Tadas", "Vilma", "Irma", "Romas", "Nerijus", "Justas", "Osama", "Liveta", "Livetukas", "Loreta", "Andrius", "Edgaras", "Rytis", "Stasys", "Raimis" };
    
    for (int i = 0; i < 31; i++)
    {
        hash<string> h;
        string hash = to_string(h(vardai[i]));

        int firstDigit = stoi(hash.substr(0, 1));
        if (firstDigit > 5)
        {
            cout << "TIKO: " << vardai[i] << "\n";
        }
        else
        {
        }
    }
    for (int i = 0; i < 31; i++)
    {
        hash<string> h;
        string hash = to_string(h(vardai[i]));

        int firstDigit = stoi(hash.substr(0, 1));
        if (firstDigit > 5)
        {
        }
        else
        {
            cout << "NETIKO: " << vardai[i] << "\n";
        }
    }

  
}

