#!/usr/bin/env node

import { addRB } from "../../src/rbTool";

addRB(process.argv.slice(2).join(' '))
