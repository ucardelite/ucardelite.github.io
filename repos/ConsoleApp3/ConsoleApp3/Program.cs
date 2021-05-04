using System;
using System.Drawing;
using System.IO;
using System.Reflection;

namespace ConsoleApp3
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"Data\blacklivesmatter.jpg");
            Bitmap image = new Bitmap(path);

            Console.WriteLine("Hello World!");
        }
    }
}
