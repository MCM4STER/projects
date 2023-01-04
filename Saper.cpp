#include <stdio.h>      /* printf, scanf, puts, NULL */
#include <stdlib.h>     /* srand, rand */
#include <time.h>
#include <iostream>
#include <string>

using namespace std;

const int mapSize = 16;
bool lose = false;


struct Sq
{
	short state = 0;
	bool containsMine = false;
	bool hasFlag = false;
	bool visible = false;
};
struct Cursor {
	int x = 0;
	int y = 0;
};

Cursor cursor;
Sq squares[mapSize][mapSize];

void generateMap(int mapSize)
{
	for (int i = 0; i < mapSize; i++)
	{
		for (int j = 0; j < mapSize; j++)
		{
			Sq square;
			squares[i][j] = square;
		}
	}
}
void setupMap(int nbOfMines, int sX, int sY)
{
	generateMap(mapSize);
	/*for (int i = 0; i < mapSize; i++)
		for (int j = 0; j < mapSize; j++) {
			squares[i][j].state = 0;
			squares[i][j].containsMine = false;
		}*/
	while (nbOfMines > 0)
	{
		int rX = rand() % mapSize;
		int rY = rand() % mapSize;
		if (rX == sX && rY == sY) continue;
		if (squares[rX][rY].containsMine) continue;
		squares[rX][rY].containsMine = true;
		nbOfMines--;
	}
	for (int x = 0; x < mapSize; x++)
	{
		for (int y = 0; y < mapSize; y++)
		{
			if (squares[x][y].containsMine) continue;
			int minesNear = 0;
			for (int i = -1; i <= 1; i++) {
				for (int j = -1; j <= 1; j++) {
					if (x + i < 0 || x + i >= mapSize || y + j < 0 || y + j >= mapSize) { continue; }
					if (squares[x + i][y + j].containsMine) {
						minesNear++;
					}
				}
			}
			squares[x][y].state = minesNear;
		}
	}
}

void draw()
{
	cout << "\x1B[2J\x1B[H";
	for (int i = 0; i <= mapSize + 1; i++)
	{
		for (int j = 0; j <= mapSize + 1; j++)
		{
			switch (i)
			{
			case 0:
				cout.width(3);
				cout << ((j == 1) ? "  |" : to_string(j - 1));
				break;
			case 1:
				cout << ((j == 1) ? "--+" : "---");
				break;
			default:
				switch (j)
				{
				case 0:
					cout.width(3);
					cout << i - 1;
					break;
				case 1:
					cout << "  |";
					break;
				default:
					if (squares[j - 2][i - 2].visible) {
						string output = to_string(squares[j - 2][i - 2].state);
						if (squares[j - 2][i - 2].state == 0) { output = " "; }
						if (squares[j - 2][i - 2].containsMine) { output = "?"; }
						if (squares[j - 2][i - 2].hasFlag) { output = "F"; }
						cout.width(3);
						cout << ((j - 2 == cursor.x && i - 2 == cursor.y) ? "[" + output + "]" : output + " ");
						break;
					}
					cout.width(3);
					cout << ((j - 2 == cursor.x && i - 2 == cursor.y) ? "[#]" : "# ");
				}
			}
		}
		cout << endl;
	}
	cout << "w,a,s,d - move; e - show; q - bomb" << endl;
}


void CalculateVisibility(int x, int y, int action)
{
	if (x >= mapSize || y >= mapSize) return;
	if (action == 2) {
		if (squares[x][y].visible && !squares[x][y].hasFlag && squares[x][y].containsMine == false) return;
		squares[x][y].hasFlag = (!squares[x][y].hasFlag);
		squares[x][y].visible = (!squares[x][y].visible);
		return;
	}
	if (squares[x][y].containsMine) { lose = true; }
	if (squares[x][y].state != 0) { squares[x][y].visible = true; return; }
	for (int i = -1; i <= 1; i++) {
		for (int j = -1; j <= 1; j++) {
			if (x + i < 0 || x + i >= mapSize || y + j < 0 || y + j >= mapSize) { continue; }
			if (squares[x + i][y + j].visible == false)
			{
				squares[x + i][y + j].visible = true;
				if (squares[x + i][y + j].state == 0)
				{
					CalculateVisibility(x + i, y + j, 1);
				}
				if (squares[x + i][y + j].containsMine)
				{
					lose = true;
				}
			}
		}
	}

}

void spawnMap(int x, int y)
{
	do {
		setupMap(mapSize * mapSize / 8, x - 1, y - 1);
	} while (squares[x - 1][y - 1].state != 0);
	CalculateVisibility(x - 1, y - 1, 0);
}

int main()
{
	srand(time(NULL));
	int sX, sY, val;
	char action;
	bool first = true;


	generateMap(mapSize);
	draw();
	while (!lose)
	{
		cin >> action;
		switch (action)
		{
		case 'w':
			if (cursor.y - 1 < 0) break;
			cursor.y--;
			break;
		case 's':
			if (cursor.y + 1 > mapSize - 1) break;
			cursor.y++;
			break;
		case 'a':
			if (cursor.x - 1 < 0) break;
			cursor.x--;
			break;
		case 'd':
			if (cursor.x + 1 > mapSize - 1) break;
			cursor.x++;
			break;
		case 'q':
			CalculateVisibility(cursor.x, cursor.y, 2);
			draw();
			break;
		case 'e':
			if (first) { spawnMap(cursor.x, cursor.y); draw(); first = false; break; }
			CalculateVisibility(cursor.x, cursor.y, 1);
			draw();
			break;
		default:
			break;
		}
		draw();
	}
	cout << "YOU LOST! ~ Try harder next time!" << endl;
	return 0;
}