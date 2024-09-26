#!/usr/bin/env node

import { addRB } from "../../pkg/rbTool";

addRB(process.argv.slice(2).join(' '))
