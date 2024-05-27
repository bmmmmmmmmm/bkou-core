#!/usr/bin/env node

import { countWords } from "../../countWords";

countWords(process.argv.slice(2).join(' '))
